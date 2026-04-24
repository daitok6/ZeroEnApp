import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BTMarquee } from '@/components/brutalist/bt-marquee';
import { BTAsciiStamp } from '@/components/brutalist/bt-ascii-stamp';
import { BTSectionHead } from '@/components/brutalist/bt-section-head';
import { BTCta } from '@/components/brutalist/bt-cta';
import { BTContainer } from '@/components/brutalist/bt-container';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tMkt = await getTranslations({ locale, namespace: 'mkt' });
  return {
    title: tMkt('home.meta.title'),
    description: tMkt('home.meta.description'),
    alternates: {
      canonical: `https://zeroen.dev/${locale === 'en' ? '' : locale}`,
      languages: {
        en: 'https://zeroen.dev/',
        ja: 'https://zeroen.dev/ja',
      },
    },
    robots: { index: true, follow: true },
  };
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ZeroEn',
  url: 'https://zeroen.dev',
  logo: 'https://zeroen.dev/logo-dark.svg',
  sameAs: ['https://x.com/ZeroEnBuilds'],
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'ZeroEn Bilingual SaaS Studio',
  provider: { '@type': 'Organization', name: 'ZeroEn', url: 'https://zeroen.dev' },
  description: 'Fixed-price bilingual Next.js + Supabase + Stripe for funded founders in Tokyo. Ships in weeks.',
  areaServed: 'JP',
  serviceType: 'Software Development',
  offers: [
    { '@type': 'Offer', name: 'Starter', price: '380000', priceCurrency: 'JPY' },
    { '@type': 'Offer', name: 'Growth',  price: '880000', priceCurrency: 'JPY' },
    { '@type': 'Offer', name: 'MVP / SaaS Build', price: '1500000', priceCurrency: 'JPY' },
  ],
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const tMkt = await getTranslations({ locale, namespace: 'mkt' });

  const heroH1Lines = (Array.isArray(tMkt.raw('home.heroH1')) ? tMkt.raw('home.heroH1') : []) as string[];
  const h1Highlight  = tMkt('home.heroH1Highlight');
  const anchorRows  = (Array.isArray(tMkt.raw('home.anchorRows')) ? tMkt.raw('home.anchorRows') : []) as Array<{ label: string; cost: string; timeline: string; muted: boolean }>;
  const icpPillars  = (Array.isArray(tMkt.raw('home.icpPillars')) ? tMkt.raw('home.icpPillars') : []) as Array<{ tag: string; title: string; desc: string }>;
  const cases       = (Array.isArray(tMkt.raw('home.cases')) ? tMkt.raw('home.cases') : []) as Array<{ name: string; url: string; desc: string; meta: string[] }>;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <BTMarquee locale={locale} />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ borderBottom: '2px solid var(--color-ink, #0A0A0A)', padding: '48px 16px 40px', backgroundColor: 'var(--color-bg, #E8E6DD)' }}>
        <BTContainer>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="md:grid-cols-[1.3fr_1fr]">
            <div>
              <BTAsciiStamp locale={locale} />
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 9vw, 104px)',
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                margin: '20px 0 18px',
                color: 'var(--color-ink, #0A0A0A)',
                textTransform: 'uppercase',
              }}>
                {heroH1Lines.map((line, i) => {
                  const idx = line.indexOf(h1Highlight);
                  if (idx !== -1 && h1Highlight) {
                    return (
                      <span key={i} style={{ display: 'block' }}>
                        {line.slice(0, idx)}
                        <span style={{ backgroundColor: 'var(--color-accent, #00E87A)', padding: '0 6px' }}>
                          {line.slice(idx, idx + h1Highlight.length)}
                        </span>
                        {line.slice(idx + h1Highlight.length)}
                      </span>
                    );
                  }
                  return <span key={i} style={{ display: 'block' }}>{line}</span>;
                })}
              </h1>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-ink-dim, #5A584F)', lineHeight: 1.6, maxWidth: '520px', marginBottom: '24px' }}>
                {'> '}{tMkt('home.heroSub')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', backgroundColor: 'var(--color-ink, #0A0A0A)', color: 'var(--color-accent, #00E87A)', padding: '3px 8px' }}>
                  {tMkt('slotsBadge')}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', border: '1px solid var(--color-ink, #0A0A0A)', color: 'var(--color-ink, #0A0A0A)', padding: '3px 8px' }}>
                  {tMkt('credential')}
                </span>
              </div>
              <BTCta locale={locale} />
            </div>
            <div /> {/* reserved for future hero visual */}
          </div>
        </BTContainer>
      </section>

      {/* ── ICP pillars ───────────────────────────────────────── */}
      <section style={{ borderBottom: '2px solid var(--color-ink, #0A0A0A)', padding: '40px 16px', backgroundColor: 'var(--color-bg, #E8E6DD)' }}>
        <BTContainer>
          <BTSectionHead label={tMkt('home.icpLabel')} heading="" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: '16px', marginTop: '16px' }}>
            {icpPillars.map((pillar) => (
              <div key={pillar.tag} className="bt-hover-shadow" style={{ border: '2px solid var(--color-ink, #0A0A0A)', padding: '20px', backgroundColor: 'var(--color-paper, #F2F0E8)' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-dim, #5A584F)',
                  marginBottom: 8,
                }}>
                  [{pillar.tag}]
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink, #0A0A0A)', marginBottom: '8px' }}>
                  {pillar.title}
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink-dim, #5A584F)', lineHeight: 1.6, margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </BTContainer>
      </section>

      {/* ── Anchor cost table ─────────────────────────────────── */}
      <section style={{ borderBottom: '2px solid var(--color-ink, #0A0A0A)', padding: '40px 16px', backgroundColor: 'var(--color-paper, #F2F0E8)' }}>
        <BTContainer>
          <BTSectionHead label={tMkt('home.anchorLabel')} heading="" />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-ink, #0A0A0A)' }}>
                  {['', 'COST', 'TIMELINE'].map((h) => (
                    <th key={h} style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '10px', color: 'var(--color-ink-dim, #5A584F)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {anchorRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px dashed var(--color-ink, #0A0A0A)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: row.muted ? 'var(--color-ink-dim, #5A584F)' : 'var(--color-ink, #0A0A0A)', textDecoration: row.muted ? 'line-through' : 'none' }}>
                      {!row.muted && <span style={{ color: 'var(--color-accent, #00E87A)', marginRight: '6px' }}>→</span>}
                      {row.label}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 700 }}>
                      {!row.muted ? (
                        <span style={{ backgroundColor: 'var(--color-accent, #00E87A)', color: 'var(--color-ink, #0A0A0A)', padding: '2px 6px' }}>{row.cost}</span>
                      ) : (
                        <span style={{ color: 'var(--color-ink-dim, #5A584F)', textDecoration: 'line-through' }}>{row.cost}</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', color: row.muted ? 'var(--color-ink-dim, #5A584F)' : 'var(--color-ink, #0A0A0A)', textDecoration: row.muted ? 'line-through' : 'none' }}>{row.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BTContainer>
      </section>

      {/* ── Live cases ────────────────────────────────────────── */}
      <section style={{ borderBottom: '2px solid var(--color-ink, #0A0A0A)', padding: '40px 16px', backgroundColor: 'var(--color-paper, #F2F0E8)' }}>
        <BTContainer>
          <BTSectionHead label={tMkt('home.caseLabel')} heading="" />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink-dim, #5A584F)', marginBottom: '16px' }}>
            {tMkt('home.caseSubtitle')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '16px' }}>
            {cases.map((c) => (
              <div key={c.name} className="bt-hover-shadow" style={{ backgroundColor: 'var(--color-ink, #0A0A0A)', border: '2px solid var(--color-ink, #0A0A0A)', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--color-accent, #00E87A)', letterSpacing: '0.1em' }}>● LIVE</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-bg, #E8E6DD)', opacity: 0.6 }}>{c.url}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: 'var(--color-bg, #E8E6DD)', letterSpacing: '-0.02em', lineHeight: 0.9, marginBottom: '12px', textTransform: 'uppercase' }}>
                  {c.name}
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-bg, #E8E6DD)', lineHeight: 1.5, marginBottom: '12px', opacity: 0.8 }}>
                  {c.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {c.meta.map((m) => (
                    <span key={m} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', border: '1px solid rgba(242,240,232,0.3)', color: 'var(--color-bg, #E8E6DD)', padding: '2px 6px' }}>{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </BTContainer>
      </section>

      {/* ── Final CTA strip ───────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--color-ink, #0A0A0A)', border: '2px solid var(--color-ink, #0A0A0A)', padding: '48px 16px', color: 'var(--color-bg, #E8E6DD)' }}>
        <BTContainer>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 6vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-bg, #E8E6DD)', textTransform: 'uppercase', lineHeight: 1.0, margin: 0 }}>
              {tMkt('home.ctaStripHeadline')}
            </h2>
            <BTCta locale={locale} />
          </div>
        </BTContainer>
      </section>
    </>
  );
}
