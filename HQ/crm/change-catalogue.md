# Change Request Catalogue — ZeroEn

Standard definitions and pricing for all out-of-scope client work. Single source of truth for scoping and billing.

---

## Billing Rate

All out-of-scope work is billed at **¥15,000/hr**, invoiced via Stripe. Scope and hours estimated before work begins. Client approves estimate before work starts.

---

## Retainer Included Hours (not billed at ¥15,000/hr)

| Retainer | Included monthly |
|----------|-----------------|
| Starter (¥15,000/mo) | 1 content update ≤1 hour |
| Growth (¥35,000/mo) | 3 content updates ≤4 hours combined |
| MVP/SaaS (¥80,000–¥150,000/mo) | 1 feature request ≤8 hours |

Unused included hours do **not** roll over.

---

## Size Definitions (for estimation)

| Size | Typical Time | Approx. Cost at ¥15,000/hr |
|------|-------------|---------------------------|
| **Small** | ~30 min | ~¥7,500 |
| **Medium** | 1–3 hours | ¥15,000–¥45,000 |
| **Large** | Half day+ | ¥60,000+ (quoted per request) |

These are estimates. Actual billing is time-based, not flat-rate. Complex requests are scoped individually before work begins.

---

## Change Examples by Category

### Content

| Size | Examples |
|------|----------|
| Small | Update text/copy on existing page, swap an image, update contact details, update a menu item |
| Medium | Write and add a new content section, add a testimonials block, create an FAQ section, add a team member bio |
| Large | Full page content rewrite, create a blog with multiple posts, write and publish a case study page |

### Design

| Size | Examples |
|------|----------|
| Small | Change button color/style, adjust font size, update brand color, change spacing on a section |
| Medium | Restructure page layout, add a new UI component (card, accordion, tabs), redesign the hero section |
| Large | Full site redesign, new visual theme, complete mobile layout overhaul |

### Functionality

| Size | Examples |
|------|----------|
| Small | Fix a broken link, update form field label, change a redirect, update an embed URL |
| Medium | Add a contact form, embed Google Maps, add a newsletter signup, add a social feed widget |
| Large | Add user authentication, build a booking system, add e-commerce, build a custom dashboard |

### SEO

| Size | Examples |
|------|----------|
| Small | Update meta title/description, add alt text, fix a canonical URL, update OG tags |
| Medium | Optimize a landing page (headings, content, internal links), add structured data (JSON-LD), submit sitemap |
| Large | Full site SEO overhaul, programmatic SEO for multiple pages, complete technical SEO audit + fixes |

### Security

| Size | Examples |
|------|----------|
| Small | Update a vulnerable dependency, check SSL status, review CSP headers |
| Medium | Security audit — WebMori scan + fix flagged issues |
| Large | Penetration test + remediation, implement rate limiting + WAF, full auth hardening |

### Analytics

| Size | Examples |
|------|----------|
| Small | Add a tracking pixel, update GA property ID, add UTM tracking |
| Medium | Set up conversion tracking, add custom events, configure Google Search Console |
| Large | Full analytics stack (GA4 + GTM + custom events), build a custom reporting dashboard |

---

## Growth Retainer — Monthly Analytics Report

Growth retainer includes one auto-generated analytics report per month (Vercel + Supabase data). Delivered via client dashboard. No manual effort required from operator.

---

## How to Request Changes

1. Client logs into the ZeroEn dashboard → "Request Change"
2. Describes the change needed
3. ZeroEn estimates hours and quotes cost before starting
4. Client approves → work begins → Stripe invoice on completion

---

## Pricing Summary

| Item | Price |
|------|-------|
| Out-of-scope work | ¥15,000/hr (estimated before work begins) |
| Small change (est.) | ~¥7,500 |
| Medium change (est.) | ¥15,000–¥45,000 |
| Large change (est.) | ¥60,000+ (quoted individually) |

---

## References

- Tier details and retainer inclusions: `HQ/docs/revenue-model.md`
- Client profiles: `HQ/crm/clients.json`
