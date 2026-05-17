/**
 * Domain Checker Router
 * Handles domain availability checking and brandability scoring
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc.js';
import { checkDomainAvailability, checkBatchAvailability, getEstimatedPricing } from '../services/domainAvailability.js';
import { calculateBrandabilityScore } from '../services/brandabilityScorer.js';
import { parseUploadedDomainList, parseDomainNamesFromText } from '../services/pdfDomainParser.js';
import { getDb, getUserSettings } from '../db.js';
import { analyzedDomains, watchlist } from '../../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';

/**
 * Build credentials object from user settings (handles null/undefined gracefully)
 */
async function getUserCredentials(userId: number) {
  try {
    const settings = await getUserSettings(userId);
    if (!settings) return undefined;
    return {
      godaddyApiKey: settings.godaddyApiKey ?? undefined,
      godaddyApiSecret: settings.godaddyApiSecret ?? undefined,
      namecheapApiKey: settings.namecheapApiKey ?? undefined,
      namecheapUsername: settings.namecheapUsername ?? undefined,
      porkbunApiKey: settings.porkbunApiKey ?? undefined,
      porkbunSecretKey: settings.porkbunSecretKey ?? undefined,
      hostingerApiKey: settings.hostingerApiKey ?? undefined,
    };
  } catch {
    // If userSettings table doesn't exist yet, return undefined (use DNS fallback)
    return undefined;
  }
}

export const domainCheckerRouter = router({
  /**
   * Check availability of a single domain
   */
  checkAvailability: protectedProcedure
    .input(z.object({
      domain: z.string(),
      keywords: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { domain, keywords = [] } = input;

      const credentials = await getUserCredentials(ctx.user.id);
      const availability = await checkDomainAvailability(domain, credentials);
      const brandability = calculateBrandabilityScore(domain, keywords);
      const pricing = getEstimatedPricing(domain);

      return {
        ...availability,
        brandability,
        pricing,
      };
    }),

  /**
   * Check availability of multiple domains
   */
  checkBatchAvailability: protectedProcedure
    .input(z.object({
      domains: z.array(z.string()),
      keywords: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { domains, keywords = [] } = input;

      const credentials = await getUserCredentials(ctx.user.id);
      const availabilityResults = await checkBatchAvailability(domains, credentials);

      const results = availabilityResults.map(result => ({
        ...result,
        brandability: calculateBrandabilityScore(result.domain, keywords),
        pricing: getEstimatedPricing(result.domain),
      }));

      return results;
    }),

  /**
   * Parse domain list from uploaded file (PDF, TXT, CSV)
   */
  parseDomainList: protectedProcedure
    .input(z.object({
      filePath: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { filePath } = input;
      const domains = await parseUploadedDomainList(filePath);
      return { domains, count: domains.length };
    }),

  /**
   * Analyze file content directly (for frontend file upload)
   * Accepts raw file text, parses domains, checks availability, scores brandability
   */
  analyzeFile: protectedProcedure
    .input(z.object({
      fileContent: z.string(),
      fileName: z.string(),
      keywords: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { fileContent, fileName, keywords = [] } = input;

      // Parse domains from text content
      const parsedDomains = parseDomainNamesFromText(fileContent);

      if (parsedDomains.length === 0) {
        return { total: 0, checked: 0, results: [] };
      }

      // Get user credentials for registrar API checks
      const credentials = await getUserCredentials(ctx.user.id);

      // Check availability for all domains
      const domainNames = parsedDomains.map(d => d.fullDomain);
      const availabilityResults = await checkBatchAvailability(domainNames, credentials);

      // Add brandability scores
      const results = availabilityResults.map(result => {
        const brandability = calculateBrandabilityScore(result.domain, keywords);
        return {
          domain: result.domain,
          available: result.available,
          brandabilityScore: brandability.score,
          registrar: result.registrar,
          status: result.status,
          pricing: result.pricing,
          error: result.error,
        };
      });

      // Sort: Available first, then by brandability score
      results.sort((a, b) => {
        if (a.available && !b.available) return -1;
        if (!a.available && b.available) return 1;
        return b.brandabilityScore - a.brandabilityScore;
      });

      return {
        total: parsedDomains.length,
        checked: results.length,
        results,
      };
    }),

  /**
   * Full analysis: Parse file + Check availability + Score brandability
   */
  analyzeUploadedList: protectedProcedure
    .input(z.object({
      filePath: z.string(),
      keywords: z.array(z.string()).optional(),
      limit: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { filePath, keywords = [], limit } = input;

      const parsedDomains = await parseUploadedDomainList(filePath);
      const domainsToCheck = limit ? parsedDomains.slice(0, limit) : parsedDomains;

      const credentials = await getUserCredentials(ctx.user.id);
      const domainNames = domainsToCheck.map(d => d.fullDomain);
      const availabilityResults = await checkBatchAvailability(domainNames, credentials);

      const results = availabilityResults.map(result => ({
        ...result,
        brandability: calculateBrandabilityScore(result.domain, keywords),
        pricing: getEstimatedPricing(result.domain),
      }));

      results.sort((a, b) => {
        if (a.available && !b.available) return -1;
        if (!a.available && b.available) return 1;
        return b.brandability.score - a.brandability.score;
      });

      return {
        total: parsedDomains.length,
        checked: results.length,
        results,
        limitApplied: limit !== undefined && parsedDomains.length > limit,
      };
    }),

  /**
   * Save domain to watchlist
   */
  saveDomainToWatchlist: protectedProcedure
    .input(z.object({
      domain: z.string(),
      brandabilityScore: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { domain, brandabilityScore } = input;
      const userId = ctx.user.id;

      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // Find or create domain in analyzedDomains
      const [existingDomain] = await db
        .select()
        .from(analyzedDomains)
        .where(eq(analyzedDomains.domainName, domain))
        .limit(1);

      let domainId: number;

      if (existingDomain) {
        domainId = existingDomain.id;
      } else {
        const [newDomain] = await db
          .insert(analyzedDomains)
          .values({
            sessionId: 0,
            domainName: domain,
            source: 'domain_checker',
            rawMetrics: JSON.stringify({ brandabilityScore }),
          });
        domainId = Number(newDomain.insertId);
      }

      // Check if already in watchlist
      const [existing] = await db
        .select()
        .from(watchlist)
        .where(and(eq(watchlist.userId, userId), eq(watchlist.domainId, domainId)))
        .limit(1);

      if (existing) {
        return { success: true, message: 'Domain already in watchlist', domainId };
      }

      await db.insert(watchlist).values({
        userId,
        domainId,
        notes: `Brandability Score: ${brandabilityScore}`,
      });

      return { success: true, message: 'Domain saved to watchlist', domainId };
    }),
});
