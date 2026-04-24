import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BTSectionHead } from '@/components/brutalist/bt-section-head';
import { BTCta } from '@/components/brutalist/bt-cta';
import { BTContainer } from '@/components/brutalist/bt-container';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tMkt = await getTranslations({ locale, namespace: 'mkt' });
  return {
    title: tMkt('pricing.meta.title'),
    description: tMkt('pricing.meta.description'),
  };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  const tMkt = await getTranslations({ locale, namespace: 'mkt' });

  const h1Lines  = tMkt.raw('pricing.h1') as string[];
  const h1Hl     = tMkt('pricing.h1Highlight');
  const tiers    = tMkt.raw('pricing.tiers') as Array<{
    name: string; price: string; timeline: string; retainer: string;
    items: string[]; featured?: boolean; badge?: string;
  }>;
  const faqs     = tMkt.raw('pricing.faqs') as Array<{ q: string; a: string }>;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const offerJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'ZeroEn Bilingual SaaS Studio',
    url: 'https://zeroen.dev',
    offers: [
      { '@type': 'Offer', name: 'Starter',         price: '380000',  priceCurrency: 'JPY' },
      { '@type': 'Offer', name: 'Growth',           price: '880000',  priceCurrency: 'JPY' },
      { '@type': 'Offer', name: 'MVP / SaaS Build', price: '1500000', priceCurrency: 'JPY' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }} />

      {/* ── H1 stack ──────────────────────────────────────────── */}
      <section style={{ borderBottom: '2px solid var(--color-ink, #0A0A0A)', padding: '48px 16px 40px', backgroundColor: 'var(--color-bg, #E8E6DD)' }}>
        <BTContainer>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 10vw, 120px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.03em', color: 'var(--color-ink, #0A0A0A)', textTransform: 'uppercase', margin: '0 0 24px' }}>
            {h1Lines.map((line, i) => {
              const isHl = line === h1Hl;
              return (
                <div key={i} style={isHl ? { backgroundColor: 'var(--color-accent, #00E87A)', color: 'var(--color-ink, #0A0A0A)', display: 'inline-block' } : {}}>
                  {line}
                </div>
              );
            })}
          </h1>
          <div style={{ display: 'inline-block', backgroundColor: 'var(--color-ink, #0A0A0A)', color: 'var(--color-bg, #E8E6DD)', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', padding: '6px 12px', marginBottom: '32px' }}>
            {tMkt('pricing.anchor').split('▶').map((part, i) => (
              <span key={i}>
                {i === 1 && <span style={{ color: 'var(--color-accent, #00E87A)', margin: '0 4px' }}>▶</span>}
                {part}
              </span>
            ))}
          </div>
        </BTContainer>
      </section>

      {/* ── Tier cards ────────────────────────────────────────── */}
      <section style={{ borderBottom: '2px solid var(--color-ink, #0A0A0A)', padding: '40px 16px', backgroundColor: 'var(--color-paper, #F2F0E8)' }}>
        <BTContainer>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {tiers.map((tier) => (
              <div
                key={tier.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: tier.featured ? '2px solid var(--color-accent, #00E87A)' : '2px solid var(--color-ink, #0A0A0A)',
                  backgroundColor: tier.featured ? 'var(--color-ink, #0A0A0A)' : 'var(--color-bg, #E8E6DD)',
                  padding: '24px',
                  boxShadow: tier.featured ? '6px 6px 0 var(--color-ink, #0A0A0A)' : '4px 4px 0 var(--color-ink, #0A0A0A)',
                  position: 'relative',
                }}
              >
                {tier.featured && tier.badge && (
                  <span style={{ position: 'absolute', top: '-12px', left: '16px', backgroundColor: 'var(--color-accent, #00E87A)', color: 'var(--color-ink, #0A0A0A)', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', padding: '2px 8px' }}>
                    ★ {tier.badge}
                  </span>
                )}
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: tier.featured ? 'var(--color-accent, #00E87A)' : 'var(--color-ink-dim, #5A584F)', marginBottom: '8px' }}>
                  {tier.name}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.02em', color: tier.featured ? 'var(--color-accent, #00E87A)' : 'var(--color-ink, #0A0A0A)', marginBottom: '4px' }}>
                  {tier.price}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: tier.featured ? 'var(--color-bg, #E8E6DD)' : 'var(--color-ink-dim, #5A584F)', marginBottom: '16px', opacity: 0.8 }}>
                  {tier.timeline} · {tier.retainer}
                </div>
                <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, flex: 1 }}>
                  {tier.items.map((item) => (
                    <li key={item} style={{ borderTop: '1px dashed ' + (tier.featured ? 'rgba(242,240,232,0.2)' : 'var(--color-ink, #0A0A0A)'), padding: '8px 0', fontFamily: 'var(--font-mono)', fontSize: '11px', color: tier.featured ? 'var(--color-bg, #E8E6DD)' : 'var(--color-ink, #0A0A0A)', display: 'flex', gap: '6px' }}>
                      <span style={{ color: 'var(--color-accent, #00E87A)', flexShrink: 0 }}>[+]</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={locale === 'ja' ? 'https://cal.com/zeroen/scoping-call-ja' : 'https://cal.com/zeroen/scoping-call'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', backgroundColor: 'var(--color-accent, #00E87A)', color: 'var(--color-ink, #0A0A0A)', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', padding: '10px', border: '2px solid var(--color-ink, #0A0A0A)' }}
                >
                  ► {tMkt('cta')}
                </a>
              </div>
            ))}
          </div>
        </BTContainer>
      </section>

      {/* ── Out-of-scope box ──────────────────────────────────── */}
      <section style={{ borderBottom: '2px solid var(--color-ink, #0A0A0A)', padding: '40px 16px', backgroundColor: 'var(--color-bg, #E8E6DD)' }}>
        <BTContainer>
          <BTSectionHead label={tMkt('pricing.oosLabel')} heading="" />
          <div style={{ border: '2px solid var(--color-ink, #0A0A0A)', padding: '24px', marginTop: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ink, #0A0A0A)', lineHeight: 1.0 }}>
              {tMkt('pricing.oosRate')}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-ink-dim, #5A584F)', maxWidth: '380px', lineHeight: 1.5 }}>
              {tMkt('pricing.oosNote')}
            </p>
          </div>
        </BTContainer>
      </section>

      {/* ── FAQ accordion ─────────────────────────────────────── */}
      <section style={{ borderBottom: '2px solid var(--color-ink, #0A0A0A)', padding: '40px 16px', backgroundColor: 'var(--color-paper, #F2F0E8)' }}>
        <BTContainer>
          <BTSectionHead label={tMkt('pricing.faqLabel')} heading="" />
          <div style={{ marginTop: '16px' }}>
            {faqs.map((faq, i) => (
              <details key={faq.q} open={i === 0} style={{ borderTop: '1px solid var(--color-ink, #0A0A0A)' }}>
                <summary style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--color-ink, #0A0A0A)', padding: '14px 0', cursor: 'pointer', letterSpacing: '0.04em', listStyle: 'none', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-accent, #00E87A)', flexShrink: 0 }}>Q{String(i + 1).padStart(2, '0')} ·</span>
                  {faq.q}
                </summary>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-ink-dim, #5A584F)', lineHeight: 1.6, padding: '0 0 16px 36px', margin: 0 }}>
                  {faq.a}
                </p>
              </details>
            ))}
            <div style={{ borderTop: '1px solid var(--color-ink, #0A0A0A)' }} />
          </div>
        </BTContainer>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section style={{ padding: '48px 16px', backgroundColor: 'var(--color-bg, #E8E6DD)' }}>
        <BTContainer>
          <BTCta locale={locale} />
        </BTContainer>
      </section>
    </>
  );
}
