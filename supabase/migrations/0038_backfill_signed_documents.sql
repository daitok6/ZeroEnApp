-- Backfill signed_documents for clients who completed onboarding before
-- outputFileTracingIncludes was added to next.config.ts.
-- recordSignature was silently failing because the legal/ directory was not
-- bundled in the Vercel function, so loadLegalBody threw and the non-fatal
-- catch swallowed the error.
--
-- This migration inserts the missing partnership_agreement row for any
-- approved client whose project has onboarding_data.signature_name set
-- but has no corresponding signed_documents row.

DO $$
DECLARE
  doc_body  text := $doc$# Partnership Agreement

**Version:** v1.1-2026-04-12
**Governing Law:** Japan (Tokyo District Court)

## 1. Future Equity (Phase 2)
Equity arrangements (SAFE notes, revenue share) are not part of Phase 1 agreements. ZeroEn currently operates as a subscription hosting service. Equity terms may be offered on select Phase 2 deals and will be documented in a separate, individually signed agreement at that time. Nothing in these terms grants or implies any equity interest.

## 2. Revenue Share (Phase 2)
Revenue share arrangements are not active in Phase 1. If a revenue share is agreed for a specific client, it will be documented in a separate written agreement signed by both parties before it takes effect. These standard terms do not constitute a revenue share agreement.

## 3. Platform Fee
After the MVP launches, a platform fee of USD $50 per month applies. This covers: hosting on ZeroEn's Vercel Pro account, one small fix or minor change per month (at ZeroEn's discretion), and a monthly analytics PDF report. The platform fee begins 30 days after launch. Payment is via Stripe subscription. The client's application remains live only while the platform fee is paid. ZeroEn's total liability under this agreement is limited to the platform fees paid by the client in the 12 months preceding any claim. ZeroEn provides the service "as is" and makes no warranties beyond uptime of the underlying Vercel infrastructure.

## 4. Scope Freeze
The MVP scope is agreed and locked at the kickoff call. This scope is documented and signed by both parties. Any features, changes, or additions beyond the agreed scope are treated as per-request charges. ZeroEn is not obligated to build out-of-scope work. Per-request charges are quoted upfront and must be paid before work begins.

## 5. Per-Request Charges
Work beyond the locked MVP scope is available as per-request charges: Small changes (1–4 hours) USD $50–100; Medium features (1–3 days) USD $200–500; Large builds (1–2 weeks) USD $500–2,000. All quotes are provided upfront. Work begins only after payment is received.

## 6. Kill Switch
If the platform fee remains unpaid for 90 consecutive days, the agreement terminates automatically. Upon termination: the client's hosted application is taken offline, ZeroEn retains full rights to the codebase. ZeroEn will make reasonable efforts to notify the client before reaching the 90-day threshold.

## 7. Reversion Clause
If the client does not launch their application within 6 months of the agreed build completion date, full code rights revert to ZeroEn. The client may request an extension in writing. Extensions are granted at ZeroEn's discretion.

## 8. IP Ownership
ZeroEn retains full ownership of all code, designs, and assets created under this agreement. The client receives a non-exclusive license to use the live hosted application for as long as the platform fee is paid. This license is non-transferable and does not include access to source code unless the client purchases a code buyout. ZeroEn always retains the right to use the work in its portfolio and marketing materials, including screenshots, case studies, and build logs.

## 9. Service Standards
ZeroEn will make reasonable efforts to keep the client's application live and performant on Vercel's infrastructure. If the client is unresponsive for 6 or more consecutive months (no replies to communications, no active use of the service), ZeroEn may pause the service with 14 days written notice.

## 10. Governing Law
These terms are governed by the laws of Japan. Any disputes are resolved first through good-faith negotiation, then through the Tokyo District Court if necessary. ZeroEn and the client agree to resolve disputes without litigation where possible.

## 11. Confidentiality & Non-Disclosure
Both ZeroEn and the client agree to keep each other's confidential information private. Confidential information includes: application data, business plans, technical specifications, financial projections, user research, and any other information shared during the application, onboarding, or build process.

Neither party will share, copy, or use the other's confidential information without written consent. Standard exclusions apply: information that is publicly available, independently developed, or legally required to be disclosed is not covered by this clause.

Data deletion: any applicant — accepted or rejected — may request deletion of all their submitted data at any time. Rejected application data is automatically deleted within 30 days of the rejection decision. Requests can be sent to the operator directly.

This confidentiality obligation survives the termination of any agreement between ZeroEn and the client for 3 years, and indefinitely for personal data.

---

**Electronic Signature:**
By typing your full name in the signature field and checking the acceptance box, you are providing an electronic signature and confirming that you have read, understood, and agree to be bound by this Partnership Agreement.$doc$;

  doc_sha256 text := '0c93b3a2e937d44db7514dad34f86390ee6034346c2001148f34bc9f6a64d139';
  r          record;
BEGIN

  FOR r IN
    SELECT
      p.client_id                                         AS user_id,
      p.onboarding_data->>'signature_name'                AS signature_name,
      coalesce(p.onboarding_data->>'ip_address', 'unknown') AS ip_address,
      coalesce(p.onboarding_data->>'user_agent', 'unknown')  AS user_agent,
      coalesce(p.onboarding_data->>'terms_accepted_at',
               p.created_at::text)                        AS signed_at,
      coalesce(p.onboarding_data->>'preferred_locale', 'en') AS locale
    FROM public.projects p
    WHERE p.onboarding_data->>'signature_name' IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.signed_documents sd
        WHERE sd.user_id = p.client_id
          AND sd.document_type = 'partnership_agreement'
          AND sd.document_version = 'v1.1-2026-04-12'
      )
  LOOP
    INSERT INTO public.signed_documents (
      user_id,
      document_type,
      document_version,
      document_sha256,
      document_body,
      signature_name,
      signed_at,
      ip_address,
      user_agent,
      locale
    ) VALUES (
      r.user_id,
      'partnership_agreement',
      'v1.1-2026-04-12',
      doc_sha256,
      doc_body,
      r.signature_name,
      r.signed_at::timestamptz,
      r.ip_address,
      r.user_agent,
      r.locale
    );

    RAISE NOTICE 'Backfilled signed_documents for user %', r.user_id;
  END LOOP;
END;
$$;
