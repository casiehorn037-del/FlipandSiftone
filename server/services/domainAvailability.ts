/**
 * Domain Availability Checker
 * Uses GoDaddy, Namecheap, Porkbun, Hostinger APIs and DNS lookup fallback
 * to check if domains are available for registration.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as dns } from 'dns';
import axios from 'axios';

const execAsync = promisify(exec);

export interface DomainAvailability {
  domain: string;
  available: boolean;
  registrar?: string;
  expirationDate?: string;
  creationDate?: string;
  status?: string;
  error?: string;
  pricing?: {
    registrar: string;
    price: number;
    currency: string;
  }[];
}

/**
 * Check domain availability using GoDaddy API
 */
async function checkGoDaddyAvailability(
  domain: string,
  apiKey?: string,
  apiSecret?: string
): Promise<DomainAvailability | null> {
  try {
    const key = apiKey || process.env.GODADDY_API_KEY;
    const secret = apiSecret || process.env.GODADDY_API_SECRET;

    if (!key || !secret) {
      return null;
    }

    // Try production first, fall back to OTE (test) environment
    const baseUrl = 'https://api.godaddy.com';

    const response = await axios.get(
      `${baseUrl}/v1/domains/available?domain=${encodeURIComponent(domain)}`,
      {
        headers: {
          'Authorization': `sso-key ${key}:${secret}`,
          'Accept': 'application/json',
        },
        timeout: 10000,
      }
    );

    const { available, price, currency } = response.data;

    return {
      domain,
      available: available === true,
      registrar: 'GoDaddy',
      status: available ? 'Available for registration' : 'Registered',
      pricing: price ? [{
        registrar: 'GoDaddy',
        price: price / 1000000, // GoDaddy returns price in micros
        currency: currency || 'USD',
      }] : undefined,
    };

  } catch (error: any) {
    // Try OTE environment as fallback
    try {
      const key = apiKey || process.env.GODADDY_API_KEY;
      const secret = apiSecret || process.env.GODADDY_API_SECRET;
      if (!key || !secret) return null;

      const response = await axios.get(
        `https://api.ote-godaddy.com/v1/domains/available?domain=${encodeURIComponent(domain)}`,
        {
          headers: {
            'Authorization': `sso-key ${key}:${secret}`,
            'Accept': 'application/json',
          },
          timeout: 10000,
        }
      );

      const { available, price, currency } = response.data;
      return {
        domain,
        available: available === true,
        registrar: 'GoDaddy',
        status: available ? 'Available for registration' : 'Registered',
        pricing: price ? [{
          registrar: 'GoDaddy',
          price: price / 1000000,
          currency: currency || 'USD',
        }] : undefined,
      };
    } catch {
      console.warn(`GoDaddy API check failed for ${domain}:`, error.message);
      return null;
    }
  }
}

/**
 * Check domain availability using Namecheap API
 */
async function checkNamecheapAvailability(
  domain: string,
  apiUser?: string,
  apiKey?: string
): Promise<DomainAvailability | null> {
  try {
    const user = apiUser || process.env.NAMECHEAP_USERNAME;
    const key = apiKey || process.env.NAMECHEAP_API_KEY;
    const clientIp = process.env.NAMECHEAP_CLIENT_IP || '1.1.1.1';

    if (!user || !key) {
      return null;
    }

    // Try production first, fall back to sandbox
    const baseUrl = 'https://api.namecheap.com/xml.response';

    const params = new URLSearchParams({
      ApiUser: user,
      ApiKey: key,
      UserName: user,
      ClientIp: clientIp,
      Command: 'namecheap.domains.check',
      DomainList: domain,
    });

    const response = await axios.get(`${baseUrl}?${params.toString()}`, {
      timeout: 10000,
    });

    const xmlText = response.data;
    const availableMatch = xmlText.match(/Available="(true|false)"/i);
    const available = availableMatch && availableMatch[1].toLowerCase() === 'true';

    return {
      domain,
      available: available || false,
      registrar: 'Namecheap',
      status: available ? 'Available for registration' : 'Registered',
      pricing: available ? [{
        registrar: 'Namecheap',
        price: getEstimatedPricing(domain).estimatedPrice,
        currency: 'USD',
      }] : undefined,
    };

  } catch (error: any) {
    console.warn(`Namecheap API check failed for ${domain}:`, error.message);
    return null;
  }
}

/**
 * Check domain availability using Porkbun API
 */
async function checkPorkbunAvailability(
  domain: string,
  apiKey: string,
  secretKey: string
): Promise<DomainAvailability | null> {
  try {
    const endpoint = `https://api.porkbun.com/api/json/v3/domain/checkDomain/${domain}`;
    const response = await axios.post(endpoint, {
      apikey: apiKey,
      secretapikey: secretKey,
    }, { timeout: 10000 });

    if (response.data.status === 'SUCCESS') {
      const isAvailable = response.data.response.avail === 'yes';
      const price = response.data.response.price ? parseFloat(response.data.response.price) : undefined;
      const regularPrice = response.data.response.regularPrice ? parseFloat(response.data.response.regularPrice) : undefined;
      return {
        domain,
        available: isAvailable,
        registrar: 'Porkbun',
        status: isAvailable ? 'Available for registration' : 'Registered',
        pricing: (price || regularPrice) ? [{
          registrar: 'Porkbun',
          price: price || regularPrice || 0,
          currency: 'USD',
        }] : undefined,
      };
    }
    return null;
  } catch (error: any) {
    console.warn(`Porkbun API check failed for ${domain}:`, error.message);
    return null;
  }
}

/**
 * Check domain availability using Hostinger API
 */
async function checkHostingerAvailability(
  domain: string,
  apiKey: string
): Promise<DomainAvailability | null> {
  try {
    const parts = domain.split('.');
    const domainName = parts.slice(0, -1).join('.');
    const tld = parts[parts.length - 1];
    const endpoint = 'https://api.hostinger.com/api/domains/v1/availability';
    const response = await axios.post(
      endpoint,
      { domain: domainName, tlds: [tld], with_alternatives: false },
      { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, timeout: 10000 }
    );
    const result = response.data[`${domainName}.${tld}`];
    const isAvailable = result?.is_available === true;
    return {
      domain,
      available: isAvailable,
      registrar: 'Hostinger',
      status: isAvailable ? 'Available for registration' : 'Registered',
    };
  } catch (error: any) {
    console.warn(`Hostinger API check failed for ${domain}:`, error.message);
    return null;
  }
}

/**
 * Check domain availability using DNS lookup (reliable fallback, no external API needed)
 * If a domain resolves in DNS (has A/AAAA/NS records), it's registered.
 * If DNS lookup fails with NXDOMAIN, the domain is likely available.
 */
async function checkDnsAvailability(domain: string): Promise<DomainAvailability> {
  try {
    // Try to resolve NS records — every registered domain has NS records
    await dns.resolveNs(domain);
    // If we get here, NS records exist → domain is registered
    return {
      domain,
      available: false,
      registrar: 'Unknown',
      status: 'Registered (DNS check)',
    };
  } catch (nsError: any) {
    if (nsError.code === 'ENOTFOUND' || nsError.code === 'ENODATA') {
      // No NS records found — likely available, but double-check with A record
      try {
        await dns.resolve4(domain);
        // Has A record but no NS? Unusual but treat as registered
        return {
          domain,
          available: false,
          registrar: 'Unknown',
          status: 'Registered (DNS check)',
        };
      } catch (aError: any) {
        if (aError.code === 'ENOTFOUND' || aError.code === 'ENODATA') {
          // No A record either — domain is likely available
          return {
            domain,
            available: true,
            status: 'Likely available (DNS check)',
            pricing: [{
              registrar: 'Estimated',
              price: getEstimatedPricing(domain).estimatedPrice,
              currency: 'USD',
            }],
          };
        }
        // DNS timeout or other error — mark as unknown
        return {
          domain,
          available: false,
          status: 'Unknown (DNS timeout)',
          error: `DNS check inconclusive: ${aError.message}`,
        };
      }
    }

    // DNS timeout or server error — mark as unknown rather than available
    return {
      domain,
      available: false,
      status: 'Unknown (DNS error)',
      error: `DNS check failed: ${nsError.message}`,
    };
  }
}

/**
 * Check domain availability with fallback chain:
 * GoDaddy → Namecheap → Porkbun → Hostinger → DNS lookup
 */
export async function checkDomainAvailability(
  domain: string,
  credentials?: {
    godaddyApiKey?: string;
    godaddyApiSecret?: string;
    namecheapApiKey?: string;
    namecheapUsername?: string;
    porkbunApiKey?: string;
    porkbunSecretKey?: string;
    hostingerApiKey?: string;
  }
): Promise<DomainAvailability> {
  // Try GoDaddy
  const godaddyResult = await checkGoDaddyAvailability(
    domain,
    credentials?.godaddyApiKey,
    credentials?.godaddyApiSecret
  );
  if (godaddyResult) return godaddyResult;

  // Try Namecheap
  const namecheapResult = await checkNamecheapAvailability(
    domain,
    credentials?.namecheapUsername,
    credentials?.namecheapApiKey
  );
  if (namecheapResult) return namecheapResult;

  // Try Porkbun if credentials provided
  if (credentials?.porkbunApiKey && credentials?.porkbunSecretKey) {
    const porkbunResult = await checkPorkbunAvailability(
      domain,
      credentials.porkbunApiKey,
      credentials.porkbunSecretKey
    );
    if (porkbunResult) return porkbunResult;
  }

  // Try Hostinger if credentials provided
  if (credentials?.hostingerApiKey) {
    const hostingerResult = await checkHostingerAvailability(domain, credentials.hostingerApiKey);
    if (hostingerResult) return hostingerResult;
  }

  // Fall back to DNS lookup (always works, no API keys needed)
  return await checkDnsAvailability(domain);
}

/**
 * Check availability for multiple domains in batches
 */
export async function checkBatchAvailability(
  domains: string[],
  credentials?: {
    godaddyApiKey?: string;
    godaddyApiSecret?: string;
    namecheapApiKey?: string;
    namecheapUsername?: string;
    porkbunApiKey?: string;
    porkbunSecretKey?: string;
    hostingerApiKey?: string;
  }
): Promise<DomainAvailability[]> {
  const results: DomainAvailability[] = [];

  // Process in batches of 10 for DNS (no rate limit), 5 for API
  const batchSize = (credentials?.godaddyApiKey || credentials?.namecheapApiKey) ? 5 : 10;

  for (let i = 0; i < domains.length; i += batchSize) {
    const batch = domains.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(domain => checkDomainAvailability(domain, credentials))
    );

    results.push(...batchResults);

    // Small delay between batches when using API keys to avoid rate limiting
    if (i + batchSize < domains.length && (credentials?.godaddyApiKey || credentials?.namecheapApiKey)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Get estimated pricing for domain registration
 * Returns typical market prices (not real-time API prices)
 */
export function getEstimatedPricing(domain: string): { tld: string; estimatedPrice: number; currency: string } {
  const tld = domain.split('.').pop()?.toLowerCase() || 'com';

  const pricingMap: Record<string, number> = {
    'com': 12.99,
    'net': 14.99,
    'org': 14.99,
    'ca': 14.99,
    'io': 39.99,
    'co': 24.99,
    'ai': 89.99,
    'app': 14.99,
    'dev': 14.99,
    'tech': 19.99,
    'online': 29.99,
    'store': 49.99,
    'shop': 29.99,
    'info': 9.99,
    'biz': 14.99,
    'us': 9.99,
    'xyz': 9.99,
    'club': 9.99,
    'site': 14.99,
    'me': 19.99,
  };

  return {
    tld,
    estimatedPrice: pricingMap[tld] || 19.99,
    currency: 'USD',
  };
}

/**
 * Get affiliate purchase links for domain registrars
 */
export function getAffiliatePurchaseLink(
  domain: string,
  registrar: 'namecheap' | 'godaddy' | 'porkbun' | 'hostinger'
): string {
  if (registrar === 'namecheap') {
    return `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`;
  } else if (registrar === 'porkbun') {
    return `https://porkbun.com/checkout/search?q=${encodeURIComponent(domain)}`;
  } else if (registrar === 'hostinger') {
    return `https://www.hostinger.com/domain-name-search?domain=${encodeURIComponent(domain)}`;
  } else {
    return `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${encodeURIComponent(domain)}`;
  }
}
