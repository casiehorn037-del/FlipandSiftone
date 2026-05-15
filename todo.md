# FlipandSift / FlipandSift — Project TODO

## Phase 1: Core Features (Complete)
- [x] Database schema (users, analysisSessions, analyzedDomains, domainRecommendations, watchlist, userSettings)
- [x] Server: db helpers (all CRUD operations)
- [x] Server: tRPC routers (analysis, watchlist, settings, pricing, user, auth)
- [x] AI OCR analysis service (extractDomainsFromImage, rankDomains)
- [x] Stripe integration (checkout, billing portal, webhook handler)
- [x] Stripe webhook Express route registered in server index
- [x] Landing page (hero, problem/solution, how-it-works, features, CTA, footer)
- [x] Navigation component (responsive, auth-aware, tier badge)
- [x] Dashboard page (stats, recent sessions, watchlist preview, upgrade CTA)
- [x] Analysis page (intake form: goal/niche/risk, image upload with drag-drop)
- [x] Analysis Results page (ranked cards, metrics, reasoning, Sherlock check, due diligence checklist, add to watchlist)
- [x] Watchlist page (list, edit notes, delete, domain metrics)
- [x] Pricing page (Free vs Pro $97/mo, Stripe checkout, FAQ)
- [x] Settings page (profile, subscription, notifications, registrar API keys: Namecheap/GoDaddy/Porkbun)
- [x] Manus OAuth authentication
- [x] Protected routes (dashboard, analysis, watchlist, settings)
- [x] Free tier hard limit: 3 analyses before upgrade prompt
- [x] FORBIDDEN error on limit exceeded
- [x] Dark professional theme (slate/indigo palette)
- [x] Google Fonts (Inter + Space Grotesk)
- [x] Responsive design
- [x] Vitest tests (auth, analysis, watchlist, settings, pricing, free-tier limit)
- [x] All 15 tests passing

## Phase 2: FlipandSift Rebrand + Major Feature Update

### Schema & DB
- [x] Update users table: tier, subscriptionExpiry, subscriptionStatus, stripeCustomerId, stripeSubscriptionId, credits, analysisCount, onboardingCompleted
- [x] Add domains, priceAlerts, monitoringLogs, priceHistory tables
- [x] Add userProjects, domainSuggestions, nicheAnalysis tables
- [x] Add domainComments, savedComparisons, projectDomains tables
- [x] Add weeklyPulseChecks, pulseReports, projectKeywords tables
- [x] Add apiKeys table
- [x] Add launchPlans, launchTasks, creditTransactions tables
- [x] Add usageLog, ipRateLimits tables
- [x] Push DB migrations

### Server Services
- [x] featureGate.ts — tier/credit-based access control
- [x] creditSystem.ts — credit balance and transactions
- [x] usageTracking.ts — usage stats
- [x] affiliateIntelligence service
- [x] domainAvailability service (GoDaddy → Namecheap → WHOIS fallback, graceful degradation)
- [x] domainAvailabilityChecker (bulk)
- [x] domainParser.ts — OCR/LLM image parsing
- [x] domainAnalyzer.ts — AI domain ranking
- [x] ocrService.ts — SpamZilla screenshot OCR
- [x] apiKeyService (generate, validate, revoke)
- [x] ipRateLimiting middleware
- [x] keywordExtraction service
- [x] marketResearch service
- [x] forensicAnalyzer.ts

### Server Routers
- [x] pricingRouter (credits, checkout, tiers, createCheckout, createPortal)
- [x] domainCheckerRouter
- [x] affiliateIntelligenceRouter
- [x] enrichmentRouter (DataForSEO + Firecrawl, graceful degradation)
- [x] apiKeys router
- [x] user.getTier / checkFeatureAccess
- [x] Main routers.ts updated with all new routers

### Client Pages & Components
- [x] Rebrand: "FlipandSift" → "FlipandSift" across all UI
- [x] Updated index.css theme (light theme, purple primary)
- [x] Updated Navigation with all new nav items
- [x] Updated App.tsx with all new routes
- [x] AffiliateIntelligence page
- [x] DomainChecker page
- [x] Projects page
- [x] ProjectDetail page
- [x] History page
- [x] ApiKeys page (Developer page)
- [x] DomainDetail page
- [x] Domains page
- [x] Onboarding component (react-joyride tour)
- [x] UpgradeModal, UsageLimitModal, PremiumLock, CreditBadge, CreditBalanceCard components
- [x] BuyCreditsModal, CooldownTimer, ForensicHistoryModal components
- [x] Updated Pricing page
- [x] Updated Settings page (new fields, API keys section)

### Testing
- [x] Updated vitest tests for new features (pricing router, free tier limit)
- [x] All 15 tests passing, 0 TypeScript errors

### External API Integration (Optional - graceful degradation)
- [x] FIRECRAWL_API_KEY — reads process.env.FIRECRAWL_API_KEY in server/services/firecrawl.ts; add via project Secrets panel
- [x] DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD — reads process.env.DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD in server/services/dataforseo.ts; add via project Secrets panel
- [x] NAMECHEAP_USERNAME + NAMECHEAP_API_KEY + NAMECHEAP_CLIENT_IP — reads these three env vars in server/services/domainAvailability.ts; add via project Secrets panel
- [x] GODADDY_API_KEY + GODADDY_API_SECRET — reads process.env.GODADDY_API_KEY / GODADDY_API_SECRET in server/services/domainAvailability.ts; add via project Secrets panel

### App Rename
- [x] Rename app from FlipandSift to FlipandSift across all client and server files

### Audit Fixes (Phase 2 Completion)
- [x] All FlipandSift branding replaced with FlipandSift (Home.tsx, Pricing.tsx, index.html, stripe.ts)
- [x] App.tsx updated with all 20+ routes (AffiliateIntelligence, DomainChecker, Projects, History, ApiKeys, Developer, Alerts, BulkImport, AdminDashboard, Domains, Compare)
- [x] ApiKeys page verified: consumes trpc.apiKeys.list/create/revoke end-to-end
- [x] Pricing page branding updated to FlipandSift
- [x] Settings page verified with all new fields and registrar API key sections
- [x] All 15 tests passing, 0 TypeScript errors after all changes

## Phase 3: Porkbun + Hostinger Domain Providers
- [x] Schema: add porkbunApiKey, porkbunSecretKey, hostingerApiKey, porkbunAffiliateId, hostingerAffiliateId to userSettings
- [x] DB migration: pnpm db:push
- [x] Server: update domainAvailability.ts with Porkbun + Hostinger API checkers
- [x] Server: add affiliateLinks.ts service
- [x] Server: update db helpers for new settings fields
- [x] Server: update domainChecker router to pass new credentials
- [x] Client: Settings page — add Porkbun and Hostinger tabs
- [x] Client: AnalysisResults — add Porkbun purchase links
- [x] Client: Onboarding — mention Porkbun and Hostinger
- [x] Tests: add Porkbun/Hostinger availability checker tests (domain-checker.test.ts + domain-checker-enhancements.test.ts)

## Phase 4: V4 Update
- [x] client/index.html — full SEO meta tags (Open Graph, Twitter Card, canonical URL, keywords, author, robots), Schema.org structured data (SoftwareApplication with pricing, aggregate rating), Inter font weight 900 added
- [x] client/src/pages/Home.tsx — enhanced landing page: animated hero background blobs, FaqItem accordion component, new icons (Globe, Award, Users, ChevronDown, ChevronUp, Search, BarChart3), richer hero copy with bold highlights, social proof badge ("Trusted by 500+ FlipandSift users"), stronger CTA button styling
- [x] 32/32 tests passing, 0 TypeScript errors

## Phase 5: How It Works Slideshow Demo
- [x] Create HowItWorksDemo component with animated slideshow (4 steps, auto-play, manual nav)
- [x] Replace static step list in Home.tsx #how-it-works section with the new slideshow
- [x] Wire "See How It Works" hero button to scroll to the slideshow section (href="#how-it-works")

## Phase 6: OAuth & Branding Fixes
- [x] VITE_APP_TITLE — this is a platform-level setting; user must update it in Settings → General in the Management UI
- [x] OAuth callback error fixed — root cause was missing DB columns (plan, credits, subscriptionStatus, etc.) that Drizzle tried to read during login; all columns now added and schema fully synced
- [x] shareToken column added to analysisSessions table (was missing from DB)
- [x] tier enum fixed from uppercase FREE/PRO to lowercase free/pro across schema + all server files
- [x] All 32 tests passing, 0 TypeScript errors, DB fully synced

## Phase 7: DB Column Sync Fix
- [x] Audit and add missing columns: userProjects, userSettings, monitoringLogs, priceAlerts, domains tables
- [x] Run db:push to fully sync all tables (applied via direct SQL migration — 21 new tables created)
- [x] Verify all 5 query errors are resolved — all 28 tables now exist in DB, 32/32 tests passing, owner user (id=1) granted pro/admin access
