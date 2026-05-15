/**
 * PDF Domain List Parser
 * Extracts domain names from uploaded PDF, TXT, and CSV files
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export interface ParsedDomain {
  domain: string;
  tld: string;
  fullDomain: string;
}

/**
 * Extract text from PDF using pdftotext (from poppler-utils, pre-installed)
 */
async function extractTextFromPDF(pdfPath: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`pdftotext "${pdfPath}" -`);
    return stdout;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Comprehensive list of valid TLDs
const VALID_TLDS = new Set([
  'com', 'net', 'org', 'io', 'co', 'ai', 'app', 'dev', 'tech', 'online',
  'store', 'shop', 'info', 'biz', 'us', 'uk', 'ca', 'au', 'de', 'fr',
  'es', 'it', 'nl', 'ru', 'br', 'mx', 'jp', 'cn', 'in', 'edu', 'gov',
  'mil', 'int', 'me', 'tv', 'cc', 'ws', 'mobi', 'name', 'pro', 'tel',
  'travel', 'jobs', 'museum', 'coop', 'aero', 'asia', 'cat', 'post',
  'xyz', 'club', 'site', 'website', 'space', 'fun', 'life', 'world',
  'media', 'news', 'blog', 'digital', 'agency', 'studio', 'design',
  'marketing', 'solutions', 'services', 'systems', 'network', 'group',
  'global', 'international', 'ventures', 'capital', 'finance', 'money',
  'cash', 'bank', 'insurance', 'health', 'care', 'clinic', 'dental',
  'legal', 'law', 'attorney', 'accountant', 'tax', 'realty', 'estate',
  'homes', 'house', 'property', 'land', 'farm', 'garden', 'food',
  'restaurant', 'cafe', 'bar', 'pub', 'hotel', 'travel', 'tours',
  'photo', 'photography', 'video', 'film', 'music', 'art', 'gallery',
  'fashion', 'style', 'beauty', 'hair', 'spa', 'fitness', 'yoga',
  'sport', 'soccer', 'football', 'basketball', 'golf', 'tennis',
  'auto', 'cars', 'car', 'bike', 'moto', 'boat', 'flights', 'taxi',
  'pizza', 'coffee', 'beer', 'wine', 'vodka', 'kitchen', 'recipes',
  'academy', 'school', 'university', 'college', 'institute', 'courses',
  'training', 'coach', 'consulting', 'management', 'expert', 'guru',
  'ninja', 'rocks', 'cool', 'best', 'top', 'plus', 'pro', 'vip',
  'zone', 'center', 'hub', 'base', 'lab', 'labs', 'works', 'tools',
  'cloud', 'host', 'hosting', 'server', 'email', 'mail', 'chat',
  'social', 'community', 'forum', 'wiki', 'directory', 'link', 'links',
  'click', 'download', 'software', 'app', 'mobile', 'android', 'apple',
  'games', 'game', 'play', 'casino', 'poker', 'bet', 'win', 'lottery',
  'adult', 'sex', 'porn', 'xxx', 'dating', 'singles', 'love', 'date',
  'gifts', 'flowers', 'jewelry', 'diamonds', 'gold', 'silver',
  'deals', 'sale', 'discount', 'coupon', 'promo', 'offer', 'free',
  'cheap', 'low', 'price', 'prices', 'compare', 'review', 'reviews',
  'news', 'press', 'magazine', 'journal', 'report', 'reports',
  'guide', 'guides', 'tips', 'advice', 'help', 'support', 'care',
  'live', 'stream', 'tv', 'radio', 'podcast', 'show', 'shows',
  'events', 'event', 'tickets', 'booking', 'reservations', 'rental',
  'rentals', 'lease', 'buy', 'sell', 'trade', 'market', 'markets',
  'exchange', 'auction', 'auctions', 'bid', 'bids',
]);

/**
 * Parse domain names from text content
 * Handles all common formats:
 * - example.com (full domain on its own line or inline)
 * - example .com (space before TLD)
 * - CSV/TSV with domain in first column
 * - Numbered lists: 1. example.com
 * - Bulleted lists: • example.com
 * - SpamZilla export format
 * - Plain text with mixed content
 */
export function parseDomainNamesFromText(text: string): ParsedDomain[] {
  const domains: ParsedDomain[] = [];
  const seen = new Set<string>();

  // Build TLD pattern from our comprehensive list
  const tldPattern = Array.from(VALID_TLDS).join('|');

  // Pattern 1: Full domains anywhere in text (most reliable)
  // Matches: example.com, sub.example.co.uk, my-domain.io, etc.
  const fullDomainRegex = new RegExp(
    `(?:^|[\\s,;|\\t"'(\\[])([a-z0-9](?:[a-z0-9\\-]{0,61}[a-z0-9])?\\.(?:${tldPattern})(?:\\.[a-z]{2})?)(?:[\\s,;|\\t"')\\]\\n]|$)`,
    'gim'
  );

  let match;
  while ((match = fullDomainRegex.exec(text)) !== null) {
    const fullDomain = match[1].toLowerCase().trim();
    if (!seen.has(fullDomain) && isValidDomain(fullDomain)) {
      seen.add(fullDomain);
      const lastDot = fullDomain.lastIndexOf('.');
      // Handle two-part TLDs like .co.uk
      const parts = fullDomain.split('.');
      let domainPart: string;
      let tldPart: string;
      if (parts.length >= 3 && parts[parts.length - 2].length <= 3) {
        // Possible ccTLD like .co.uk, .com.au
        domainPart = parts.slice(0, -2).join('.');
        tldPart = '.' + parts.slice(-2).join('.');
      } else {
        domainPart = parts.slice(0, -1).join('.');
        tldPart = '.' + parts[parts.length - 1];
      }
      domains.push({ domain: domainPart, tld: tldPart, fullDomain });
    }
  }

  // Pattern 2: Line-by-line parsing for formats where each line is a domain
  const lines = text.split(/\r?\n/);
  for (const rawLine of lines) {
    // Strip common list markers, quotes, whitespace
    let line = rawLine
      .trim()
      .replace(/^[\d]+[\.\)\-\s]+/, '')   // numbered lists: "1. " or "1) "
      .replace(/^[•\-\*\>\#\|]+\s*/, '')  // bullets
      .replace(/^["']|["']$/g, '')         // surrounding quotes
      .replace(/,.*$/, '')                  // CSV: take first column only
      .replace(/\t.*$/, '')                 // TSV: take first column only
      .trim();

    // Skip empty, too short, or clearly non-domain lines
    if (!line || line.length < 4 || line.includes(' ') || line.startsWith('http')) {
      continue;
    }

    // If it already looks like a full domain (has a dot), try to validate it
    if (line.includes('.')) {
      const candidate = line.toLowerCase();
      if (!seen.has(candidate) && isValidDomain(candidate)) {
        seen.add(candidate);
        const parts = candidate.split('.');
        let domainPart: string;
        let tldPart: string;
        if (parts.length >= 3 && parts[parts.length - 2].length <= 3) {
          domainPart = parts.slice(0, -2).join('.');
          tldPart = '.' + parts.slice(-2).join('.');
        } else {
          domainPart = parts.slice(0, -1).join('.');
          tldPart = '.' + parts[parts.length - 1];
        }
        domains.push({ domain: domainPart, tld: tldPart, fullDomain: candidate });
      }
    }
  }

  console.log(`[Domain Parser] Extracted ${domains.length} unique domains from text`);
  return domains;
}

/**
 * Validate that a string looks like a real domain name
 */
function isValidDomain(domain: string): boolean {
  // Must have at least one dot
  if (!domain.includes('.')) return false;

  // Must not be too long
  if (domain.length > 253) return false;

  const parts = domain.split('.');

  // Must have at least 2 parts
  if (parts.length < 2) return false;

  // TLD must be in our known list
  const tld = parts[parts.length - 1].toLowerCase();
  if (!VALID_TLDS.has(tld)) {
    // Check for two-part TLD
    if (parts.length >= 3) {
      const tld2 = parts.slice(-2).join('.').toLowerCase();
      const knownTwoPartTlds = ['co.uk', 'co.nz', 'co.za', 'co.in', 'co.jp', 'com.au', 'com.br', 'com.mx', 'org.uk', 'net.au'];
      if (!knownTwoPartTlds.includes(tld2)) return false;
    } else {
      return false;
    }
  }

  // Each label must be valid
  for (const part of parts) {
    if (!part) return false;
    if (part.length > 63) return false;
    if (!/^[a-z0-9][a-z0-9\-]*[a-z0-9]$|^[a-z0-9]$/.test(part)) return false;
  }

  // Skip common false positives (file extensions, version numbers, etc.)
  const skipPatterns = [
    /^\d+\.\d+$/, // version numbers like 1.0
    /^\d+\.\d+\.\d+$/, // version numbers like 1.0.0
  ];
  if (skipPatterns.some(p => p.test(domain))) return false;

  return true;
}

/**
 * Parse domains from uploaded PDF file
 */
export async function parsePDFDomainList(pdfPath: string): Promise<ParsedDomain[]> {
  try {
    const text = await extractTextFromPDF(pdfPath);
    const domains = parseDomainNamesFromText(text);
    console.log(`[PDF Parser] Extracted ${domains.length} domains from PDF`);
    return domains;
  } catch (error) {
    console.error('Error parsing PDF domain list:', error);
    throw error;
  }
}

/**
 * Parse domains from text file (.txt, .csv)
 */
export async function parseTextDomainList(filePath: string): Promise<ParsedDomain[]> {
  try {
    const text = await fs.readFile(filePath, 'utf-8');
    const domains = parseDomainNamesFromText(text);
    console.log(`[Text Parser] Extracted ${domains.length} domains from text file`);
    return domains;
  } catch (error) {
    console.error('Error parsing text domain list:', error);
    throw error;
  }
}

/**
 * Auto-detect file type and parse accordingly
 */
export async function parseUploadedDomainList(filePath: string): Promise<ParsedDomain[]> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    return parsePDFDomainList(filePath);
  } else if (ext === '.txt' || ext === '.csv') {
    return parseTextDomainList(filePath);
  } else {
    throw new Error(`Unsupported file type: ${ext}. Please upload PDF, TXT, or CSV files.`);
  }
}
