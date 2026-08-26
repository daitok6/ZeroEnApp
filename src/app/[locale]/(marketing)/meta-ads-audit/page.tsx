import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BTContainer } from '@/components/brutalist/bt-container';
import { BTSectionHead } from '@/components/brutalist/bt-section-head';
import { BTBox } from '@/components/brutalist/bt-box';
import { AuditInquiryForm } from './audit-inquiry-form';

export function generateMetadata(): Metadata {
  return {
    title: 'Independent Meta Ads Audit | ZeroEn',
    description:
      'A one-time independent Meta Ads account review for ecommerce and DTC businesses. Get prioritized recommendations without a management contract.',
    alternates: { canonical: 'https://zeroen.dev/en/meta-ads-audit' },
  };
}

const REVIEW_CATEGORIES: { title: string; points: string[] }[] = [
  {
    title: 'Measurement',
    points: ['Pixel and Conversions API setup', 'Event quality', 'Conversion signals', 'Obvious measurement gaps'],
  },
  {
    title: 'Account structure',
    points: ['Campaign / ad set structure', 'Fragmentation', 'Budget allocation', 'Unnecessary complexity'],
  },
  {
    title: 'Audiences',
    points: ['Targeting structure', 'Overlap', 'Exclusions', 'Unnecessary restrictions'],
  },
  {
    title: 'Creative',
    points: ['Format mix', 'Fatigue signals', 'Messaging consistency', 'Testing opportunities'],
  },
  {
    title: 'Delivery',
    points: ['Placements', 'Bidding approach', 'Spend distribution', 'Unnecessary constraints'],
  },
  {
    title: 'Conversion path',
    points: ['Ad / message / landing-page consistency', 'Obvious conversion friction'],
  },
];

const DELIVERABLES = [
  'Written audit of the most important findings',
  'Prioritized list of what I would address first',
  'Explanation of why each finding matters',
  'Screenshots / examples where useful',
  'Practical next-step recommendations',
  'Optional short Google Meet walkthrough',
  'Follow-up questions by email',
];

const GOOD_FIT = [
  'Ecommerce / DTC',
  'Currently running Meta Ads',
  'Owner-managed or small marketing team',
  'Wants an independent second opinion',
  'Considering a meaningful change or scaling up',
];

const NOT_A_FIT = [
  'Not currently running Meta Ads',
  'Wants daily campaign management',
  'Enterprise procurement complexity',
  'Expects guaranteed results',
  'Wants full execution, not an audit',
];

const PROCESS_STEPS: { n: string; name: string; desc: string }[] = [
  { n: '1', name: 'Request the audit', desc: 'Send a short note about your business and Meta Ads setup.' },
  { n: '2', name: 'Confirm scope and access', desc: "I'll explain what I need to review and answer questions before you proceed." },
  { n: '3', name: 'Pay the one-time pilot fee', desc: 'US$325. No recurring contract.' },
  { n: '4', name: 'I review the account', desc: 'Measurement, structure, audiences, creative, delivery, and conversion path.' },
  { n: '5', name: 'Receive the findings', desc: 'Prioritized report plus optional Google Meet walkthrough.' },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Do you need access to my Meta Ads account?',
    a: "Yes. I need sufficient read-only access to review the relevant account setup and performance information. I'll explain exactly what access is needed before you proceed.",
  },
  {
    q: 'Will you change anything in my account?',
    a: 'No. This is an audit and recommendation service. I do not edit campaigns, budgets, audiences, or tracking as part of the audit.',
  },
  {
    q: 'Do you manage Meta Ads afterward?',
    a: 'No. There is no required campaign-management service or ongoing retainer attached to this pilot.',
  },
  {
    q: 'Can you guarantee improved ROAS or lower CPA?',
    a: 'No. Advertising performance depends on many factors, and I do not guarantee specific performance outcomes. The audit is designed to identify issues, opportunities, and priorities.',
  },
  {
    q: 'Can we handle everything by email?',
    a: 'Yes. A meeting is optional. If you prefer, the process can be handled entirely by email.',
  },
  {
    q: 'How is my account information handled?',
    a: 'Your account information is used only for the purpose of completing the audit. I do not publish or share client account data without permission.',
  },
  {
    q: 'Is this only for US businesses?',
    a: 'No. The pilot is available internationally, although pricing may vary by market.',
  },
];

const sectionBorder = { borderBottom: '2px solid var(--color-ink, #0A0A0A)' };
const monoDim: React.CSSProperties = { fontFamily: 'var(--font-mono)', color: 'var(--color-ink-dim, #5A584F)' };

type Props = { params: Promise<{ locale: string }> };

export default async function MetaAdsAuditPage({ params }: Props) {
  const { locale } = await params;

  // English-only pilot page — /ja/meta-ads-audit redirects rather than
  // silently serving untranslated English content under a ja/ path.
  if (locale !== 'en') {
    redirect('/en/meta-ads-audit');
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const offerJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'ZeroEn Meta Ads Audit',
    url: 'https://zeroen.dev/en/meta-ads-audit',
    description: 'A one-time, independent review of a Meta Ads account: measurement, structure, audiences, creative, delivery, and conversion path.',
    offers: {
      '@type': 'Offer',
      name: 'Meta Ads Audit — pilot',
      price: '325',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }} />

      <div style={{ backgroundColor: 'var(--color-bg, #E8E6DD)' }}>

        {/* ── 1. HERO ─────────────────────────────────────────── */}
        <section style={{ ...sectionBorder, padding: '48px 16px 40px' }}>
          <BTContainer>
            <div style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-ink, #0A0A0A)',
              color: 'var(--color-accent, #00E87A)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              marginBottom: 20,
            }}>
              Meta Ads Audit — pilot
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 6.5vw, 76px)',
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-ink, #0A0A0A)',
              margin: '0 0 20px',
              maxWidth: 980,
            }}>
              A second opinion on your Meta Ads account, without the agency pitch afterward.
            </h1>

            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              lineHeight: 1.6,
              color: 'var(--color-ink, #0A0A0A)',
              maxWidth: 680,
              margin: '0 0 24px',
            }}>
              A one-time, independent review of your Meta Ads setup, measurement, creative, and spend efficiency, with a prioritized action plan you can use yourself.
            </p>

            <div style={{
              display: 'inline-block',
              border: '2px solid var(--color-ink, #0A0A0A)',
              backgroundColor: 'var(--color-paper, #F2F0E8)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.06em',
              padding: '8px 14px',
              marginBottom: 28,
            }}>
              US$325 pilot · 3 pilot spots · No management contract
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
              <a
                href="#scope"
                className="bt-hover-shadow"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  backgroundColor: 'var(--color-accent, #00E87A)',
                  color: 'var(--color-ink, #0A0A0A)',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
                  border: '2px solid var(--color-ink, #0A0A0A)',
                  boxShadow: '4px 4px 0 var(--color-ink, #0A0A0A)',
                  padding: '12px 20px',
                }}
              >
                <span aria-hidden="true">►</span> See what&apos;s included
              </a>
              <a
                href="#request"
                className="bt-hover-shadow"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  backgroundColor: 'var(--color-bg, #E8E6DD)',
                  color: 'var(--color-ink, #0A0A0A)',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
                  border: '2px solid var(--color-ink, #0A0A0A)',
                  padding: '12px 20px',
                }}
              >
                Request an audit
              </a>
            </div>

            <p style={{ ...monoDim, fontSize: 12, lineHeight: 1.6, maxWidth: 620, margin: 0 }}>
              No campaign management upsell. No performance guarantees. Just an independent review of what I see and what I&apos;d prioritize.
            </p>
          </BTContainer>
        </section>

        {/* ── 2. WHY THIS EXISTS ──────────────────────────────── */}
        <section style={{ ...sectionBorder, padding: '40px 16px', backgroundColor: 'var(--color-paper, #F2F0E8)' }}>
          <BTContainer>
            <BTSectionHead label="WHY // THIS EXISTS" heading="You might not need another agency. You might need another pair of eyes." />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, color: 'var(--color-ink, #0A0A0A)' }}>
                <p style={{ margin: 0 }}>
                  Meta Ads accounts get complicated quietly. Campaigns pile up, tracking drifts, and decisions from months ago keep running simply because no one has revisited them.
                </p>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, color: 'var(--color-ink, #0A0A0A)' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  An independent review helps before a meaningful account change. The goal isn&apos;t to rebuild — it&apos;s to help you prioritize.
                </p>
              </div>
            </div>

            {/* Trigger situations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 28 }}>
              {[
                'Before increasing spend',
                'Before restructuring campaigns',
                'Before changing agencies',
                'Before launching new creative',
                'Before a major account decision',
              ].map((trigger) => (
                <div key={trigger} className="bt-hover-shadow" style={{
                  border: '2px solid var(--color-ink, #0A0A0A)',
                  padding: '12px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  color: 'var(--color-ink, #0A0A0A)',
                  backgroundColor: 'var(--color-bg, #E8E6DD)',
                }}>
                  {trigger}
                </div>
              ))}
            </div>
          </BTContainer>
        </section>

        {/* ── 3. WHAT THIS IS / ISN'T ─────────────────────────── */}
        <section style={{ ...sectionBorder, padding: '40px 16px' }}>
          <BTContainer>
            <BTSectionHead label="SCOPE // CHECK" heading="What this is — and isn't" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
              <div style={{ border: '2px solid var(--color-ink, #0A0A0A)', padding: 20, backgroundColor: 'var(--color-ink, #0A0A0A)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-accent, #00E87A)', marginBottom: 12 }}>
                  THIS IS
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {['Independent review', 'Prioritized recommendations', 'Human-reviewed', 'One-time engagement'].map((item) => (
                    <li key={item} style={{ display: 'flex', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-bg, #E8E6DD)', padding: '8px 0', borderTop: '1px dashed rgba(232,230,221,0.2)' }}>
                      <span style={{ color: 'var(--color-accent, #00E87A)' }}>+</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ border: '2px solid var(--color-ink, #0A0A0A)', padding: 20, backgroundColor: 'var(--color-paper, #F2F0E8)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-ink-dim, #5A584F)', marginBottom: 12 }}>
                  THIS ISN&apos;T
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {['Ongoing agency retainer', 'Account management', 'Automated score generator', 'Performance guarantee'].map((item) => (
                    <li key={item} style={{ display: 'flex', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-ink, #0A0A0A)', padding: '8px 0', borderTop: '1px dashed var(--color-ink, #0A0A0A)' }}>
                      <span aria-hidden="true">−</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </BTContainer>
        </section>

        {/* ── 4. WHAT I REVIEW ────────────────────────────────── */}
        <section id="scope" style={{ ...sectionBorder, padding: '40px 16px', backgroundColor: 'var(--color-paper, #F2F0E8)', scrollMarginTop: 60 }}>
          <BTContainer>
            <BTSectionHead label="AUDIT // SCOPE" heading="What I review" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginTop: 16 }}>
              {REVIEW_CATEGORIES.map((cat) => (
                <div key={cat.title} className="bt-hover-shadow" style={{
                  border: '2px solid var(--color-ink, #0A0A0A)',
                  backgroundColor: 'var(--color-bg, #E8E6DD)',
                  padding: 20,
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 12, color: 'var(--color-ink, #0A0A0A)' }}>
                    {cat.title}
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {cat.points.map((p) => (
                      <li key={p} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6, color: 'var(--color-ink-dim, #5A584F)', display: 'flex', gap: 6, marginBottom: 4 }}>
                        <span style={{ color: 'var(--color-accent, #00E87A)', flexShrink: 0 }}>·</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <BTBox kind="hi">
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6 }}>
                  The audit identifies issues and opportunities. I do not make changes to your account as part of the audit.
                </p>
              </BTBox>
            </div>
          </BTContainer>
        </section>

        {/* ── 5. DELIVERABLES ─────────────────────────────────── */}
        <section style={{ ...sectionBorder, padding: '40px 16px' }}>
          <BTContainer>
            <BTSectionHead label="OUTPUT // DELIVERABLES" heading="You leave with a prioritized action plan" />

            {/* Flow */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, margin: '20px 0 24px' }}>
              {['What I found', 'Why it matters', 'Priority', 'What I would do next'].map((step, i, arr) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    border: '2px solid var(--color-ink, #0A0A0A)',
                    backgroundColor: 'var(--color-bg, #E8E6DD)',
                    padding: '10px 14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--color-ink, #0A0A0A)',
                    whiteSpace: 'nowrap',
                  }}>
                    {step}
                  </div>
                  {i < arr.length - 1 && (
                    <span aria-hidden="true" style={{ color: 'var(--color-accent, #00E87A)', fontWeight: 900, fontSize: 16 }}>→</span>
                  )}
                </div>
              ))}
            </div>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
              {DELIVERABLES.map((d) => (
                <li key={d} style={{
                  border: '2px solid var(--color-ink, #0A0A0A)',
                  padding: '12px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--color-ink, #0A0A0A)',
                  backgroundColor: 'var(--color-paper, #F2F0E8)',
                  display: 'flex',
                  gap: 8,
                }}>
                  <span style={{ color: 'var(--color-accent, #00E87A)', flexShrink: 0 }}>[+]</span>{d}
                </li>
              ))}
            </ul>
          </BTContainer>
        </section>

        {/* ── 6. FIT ───────────────────────────────────────────── */}
        <section style={{ ...sectionBorder, padding: '40px 16px', backgroundColor: 'var(--color-paper, #F2F0E8)' }}>
          <BTContainer>
            <BTSectionHead label="FIT // CHECK" heading="Is this for you?" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
              <div style={{ border: '2px solid var(--color-ink, #0A0A0A)', padding: 20, backgroundColor: 'var(--color-bg, #E8E6DD)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 12, color: 'var(--color-ink, #0A0A0A)' }}>
                  GOOD FIT IF
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {GOOD_FIT.map((item) => (
                    <li key={item} style={{ display: 'flex', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-ink, #0A0A0A)', padding: '8px 0', borderTop: '1px dashed var(--color-ink, #0A0A0A)' }}>
                      <span style={{ color: 'var(--color-accent, #00E87A)' }} aria-hidden="true">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ border: '2px solid var(--color-ink, #0A0A0A)', padding: 20, backgroundColor: 'var(--color-bg, #E8E6DD)', opacity: 0.85 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 12, color: 'var(--color-ink-dim, #5A584F)' }}>
                  PROBABLY NOT A FIT IF
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {NOT_A_FIT.map((item) => (
                    <li key={item} style={{ display: 'flex', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-ink-dim, #5A584F)', padding: '8px 0', borderTop: '1px dashed var(--color-ink, #0A0A0A)' }}>
                      <span aria-hidden="true">−</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </BTContainer>
        </section>

        {/* ── 7. WHY INDEPENDENT ──────────────────────────────── */}
        <section style={{ ...sectionBorder, padding: '48px 16px', backgroundColor: 'var(--color-ink, #0A0A0A)' }}>
          <BTContainer>
            <div style={{ marginBottom: 8 }}>
              <span style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-accent, #00E87A)',
                color: 'var(--color-ink, #0A0A0A)',
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
                textTransform: 'uppercase', padding: '2px 6px',
              }}>
                PRINCIPLE
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.025em', lineHeight: 0.98, textTransform: 'uppercase',
              color: 'var(--color-bg, #E8E6DD)', margin: '8px 0 20px',
            }}>
              Why independent?
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, color: 'rgba(232,230,221,0.75)' }}>
                <p style={{ margin: '0 0 14px' }}>
                  Most Meta Ads audits are attached to something else. An agency audits your account because it wants to manage it. A freelancer may want ongoing work. A software platform may want you to subscribe.
                </p>
                <p style={{ margin: 0 }}>
                  That doesn&apos;t automatically make their advice bad. But incentives matter.
                </p>
              </div>

              <div style={{ borderLeft: '2px solid var(--color-accent, #00E87A)', paddingLeft: 20 }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.4vw, 24px)', fontWeight: 700,
                  color: 'var(--color-accent, #00E87A)', lineHeight: 1.3, margin: '0 0 16px',
                }}>
                  I review the account, tell you what I see, give you my priorities, and the engagement ends there.
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, color: 'rgba(232,230,221,0.75)', margin: '0 0 8px' }}>
                  There is no required retainer and no management contract attached.
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, color: 'rgba(232,230,221,0.75)', margin: 0 }}>
                  If the answer is &ldquo;your account is basically fine,&rdquo; that is still a valid outcome.
                </p>
              </div>
            </div>
          </BTContainer>
        </section>

        {/* ── 8. ABOUT ─────────────────────────────────────────── */}
        <section style={{ ...sectionBorder, padding: '40px 16px' }}>
          <BTContainer>
            <BTSectionHead label="ABOUT // OPERATOR" heading="Hi, I'm Daito." />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '16px 0 20px' }}>
              {['Founder-led', 'Every account reviewed personally', 'Software engineering + ecommerce/data + Meta Ads'].map((tag) => (
                <span key={tag} style={{
                  display: 'inline-block',
                  border: '2px solid var(--color-ink, #0A0A0A)',
                  backgroundColor: 'var(--color-paper, #F2F0E8)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '5px 10px',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, color: 'var(--color-ink, #0A0A0A)', maxWidth: 720 }}>
              <p style={{ margin: '0 0 14px' }}>
                I&apos;m a bilingual digital marketing and technology professional based in Japan.
              </p>
              <p style={{ margin: '0 0 14px' }}>
                My background spans software development, technical project leadership, ecommerce and data work, and Meta advertising.
              </p>
              <p style={{ margin: '0 0 14px' }}>
                That combination shapes how I approach an ad account. I&apos;m interested not only in what an ad looks like, but also in the system around it: tracking, structure, signals, user journey, and whether the pieces actually make sense together.
              </p>
              <p style={{ margin: '0 0 14px' }}>
                I created ZeroEn around a simple idea: useful digital expertise should not automatically require an expensive long-term contract.
              </p>
              <p style={{ margin: 0, fontWeight: 700 }}>
                For this pilot, I personally review every account.
              </p>
            </div>
          </BTContainer>
        </section>

        {/* ── 9. PROCESS ───────────────────────────────────────── */}
        <section style={{ ...sectionBorder, padding: '40px 16px', backgroundColor: 'var(--color-paper, #F2F0E8)' }}>
          <BTContainer>
            <BTSectionHead label="PROCESS // STEPS" heading="Simple by design" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginTop: 20 }}>
              {PROCESS_STEPS.map((s, i) => (
                <div key={s.n} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 48, height: 48, border: '2px solid var(--color-ink, #0A0A0A)',
                      backgroundColor: 'var(--color-accent, #00E87A)', color: 'var(--color-ink, #0A0A0A)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, fontSize: 18, fontFamily: 'var(--font-display)',
                      boxShadow: '4px 4px 0 var(--color-ink, #0A0A0A)', flexShrink: 0,
                    }}>
                      {s.n}
                    </div>
                    {i < PROCESS_STEPS.length - 1 && (
                      <div style={{ width: 2, flex: 1, backgroundColor: 'var(--color-ink, #0A0A0A)', minHeight: 24 }} />
                    )}
                  </div>
                  <div className="bt-hover-shadow" style={{
                    border: '2px solid var(--color-ink, #0A0A0A)', backgroundColor: 'var(--color-bg, #E8E6DD)',
                    padding: '14px 18px', minWidth: 0,
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--color-ink, #0A0A0A)', marginBottom: 6 }}>
                      {s.name}
                    </div>
                    <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.55, color: 'var(--color-ink-dim, #5A584F)' }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </BTContainer>
        </section>

        {/* ── 10. PRICING + REQUEST ───────────────────────────── */}
        <section id="request" style={{ ...sectionBorder, padding: '48px 16px', scrollMarginTop: 60 }}>
          <BTContainer>
            <BTSectionHead label="PILOT // PRICING" heading="Pilot pricing" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 20, alignItems: 'start' }}>
              {/* Price card */}
              <div style={{
                border: '2px solid var(--color-ink, #0A0A0A)', backgroundColor: 'var(--color-ink, #0A0A0A)',
                padding: 28, boxShadow: '6px 6px 0 var(--color-ink, #0A0A0A)',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent, #00E87A)', marginBottom: 10 }}>
                  One-time Meta Ads Audit
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 56px)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-bg, #E8E6DD)', marginBottom: 4 }}>
                  US$325
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-accent, #00E87A)', marginBottom: 20, fontWeight: 700, letterSpacing: '0.04em' }}>
                  3 pilot audits available
                </div>

                <ul style={{ listStyle: 'none', margin: '0 0 20px', padding: 0 }}>
                  {[
                    'Independent account review',
                    'Prioritized written findings',
                    'Recommended next actions',
                    'Optional walkthrough',
                    'Follow-up questions by email',
                  ].map((item) => (
                    <li key={item} style={{ borderTop: '1px dashed rgba(242,240,232,0.2)', padding: '8px 0', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-bg, #E8E6DD)', display: 'flex', gap: 6 }}>
                      <span style={{ color: 'var(--color-accent, #00E87A)', flexShrink: 0 }}>[+]</span>{item}
                    </li>
                  ))}
                </ul>

                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7, color: 'rgba(232,230,221,0.6)', margin: '0 0 4px' }}>
                  No management contract.
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7, color: 'rgba(232,230,221,0.6)', margin: '0 0 4px' }}>
                  No recurring fee.
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7, color: 'rgba(232,230,221,0.6)', margin: 0 }}>
                  No guaranteed performance outcome.
                </p>
              </div>

              {/* Request form */}
              <div style={{ border: '2px solid var(--color-ink, #0A0A0A)', backgroundColor: 'var(--color-paper, #F2F0E8)', padding: 28 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-dim, #5A584F)', marginBottom: 16 }}>
                  Request an audit
                </div>
                <AuditInquiryForm />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-dim, #5A584F)', marginTop: 16, marginBottom: 0 }}>
                  Prefer email? Reach me directly at{' '}
                  <a href="mailto:daito@zeroen.dev" className="bt-link" style={{ color: 'var(--color-ink, #0A0A0A)', fontWeight: 700 }}>
                    daito@zeroen.dev
                  </a>
                </p>
              </div>
            </div>
          </BTContainer>
        </section>

        {/* ── 11. FAQ ──────────────────────────────────────────── */}
        <section style={{ padding: '56px 16px 72px', backgroundColor: 'var(--color-paper, #F2F0E8)' }}>
          <BTContainer>
            <BTSectionHead label="FAQ // COMMON QUESTIONS" heading="Questions" />
            <div style={{ marginTop: 24 }}>
              {FAQS.map((faq, i) => (
                <details key={faq.q} open={i === 0} style={{ borderTop: '1px solid var(--color-ink, #0A0A0A)' }}>
                  <summary style={{
                    fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--color-ink, #0A0A0A)',
                    padding: '20px 0', cursor: 'pointer', letterSpacing: '0.02em', listStyle: 'none',
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                  }}>
                    <span style={{ color: 'var(--color-accent, #00E87A)', flexShrink: 0 }}>Q{String(i + 1).padStart(2, '0')} ·</span>
                    {faq.q}
                  </summary>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-ink-dim, #5A584F)', lineHeight: 1.7, padding: '0 0 22px 44px', margin: 0 }}>
                    {faq.a}
                  </p>
                </details>
              ))}
              <div style={{ borderTop: '1px solid var(--color-ink, #0A0A0A)' }} />
            </div>
          </BTContainer>
        </section>
      </div>
    </>
  );
}
