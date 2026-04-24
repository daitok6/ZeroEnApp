import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BTContainer } from '@/components/brutalist/bt-container';
import { BTCta } from '@/components/brutalist/bt-cta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja' ? 'ZEROENの実績 — ZeroEn' : 'Built by ZeroEn — Cases',
    description: locale === 'ja'
      ? 'ZeroEnが構築した本番バイリンガルプロダクト一覧。'
      : 'Production bilingual products built by ZeroEn.',
  };
}

type Case = { name: string; url: string; desc: string; meta: string[] };

export default async function CasesPage({ params }: Props) {
  const { locale } = await params;
  const tMkt = await getTranslations('mkt');

  const cases = tMkt.raw('home.cases') as Case[];

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #E8E6DD)', minHeight: '100vh' }}>
      <BTContainer>
        {/* ── Hero ──────────────────────────────────────── */}
        <section style={{ padding: '28px 0 20px', borderBottom: '2px solid var(--color-ink, #0A0A0A)' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 8vw, 88px)',
            fontWeight: 800,
            margin: '0 0 10px',
            lineHeight: 0.92,
            letterSpacing: '-0.035em',
            textTransform: 'uppercase',
            color: 'var(--color-ink, #0A0A0A)',
          }}>
            {tMkt('cases.h1')}
          </h1>
          <p style={{
            fontSize: 13,
            fontWeight: 500,
            margin: 0,
            maxWidth: 640,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-ink, #0A0A0A)',
          }}>
            &gt; {tMkt('home.caseSubtitle')}
          </p>
        </section>

        {/* ── Case cards ────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 14,
          marginTop: 24,
        }}>
          {cases.map((c) => (
            <div
              key={c.name}
              className="bt-hover-shadow"
              style={{
                border: '2px solid var(--color-ink, #0A0A0A)',
                backgroundColor: 'var(--color-paper, #F2F0E8)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {/* header bar */}
              <div style={{
                padding: '8px 12px',
                borderBottom: '2px solid var(--color-ink, #0A0A0A)',
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: 'var(--color-bg, #E8E6DD)',
                color: 'var(--color-ink, #0A0A0A)',
              }}>
                <span>CASE // {c.name.toUpperCase()}</span>
                <span style={{ color: 'var(--color-accent, #00E87A)' }}>● LIVE</span>
              </div>
              {/* domain display */}
              <div style={{
                padding: '40px 20px',
                backgroundColor: 'var(--color-ink, #0A0A0A)',
                color: 'var(--color-accent, #00E87A)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 40,
                textAlign: 'center',
                letterSpacing: '-0.03em',
                borderBottom: '2px solid var(--color-ink, #0A0A0A)',
              }}>
                {c.url}
              </div>
              {/* desc + meta */}
              <div style={{ padding: '16px' }}>
                <p style={{ margin: '0 0 12px', fontSize: 13, lineHeight: 1.55, color: 'var(--color-ink, #0A0A0A)' }}>
                  {c.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {c.meta.map((tag) => (
                    <span key={tag} style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      border: '1px solid var(--color-ink, #0A0A0A)',
                      padding: '2px 6px',
                      color: 'var(--color-ink, #0A0A0A)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* SLOT OPEN placeholder card */}
          <div style={{
            border: '2px dashed var(--color-ink, #0A0A0A)',
            backgroundColor: 'var(--color-paper, #F2F0E8)',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            minHeight: 200,
            padding: '32px 20px',
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-dim, #5A584F)',
            }}>
              {tMkt('cases.slotOpenLabel')}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--color-accent, #00E87A)',
              letterSpacing: '-0.02em',
            }}>
              {tMkt('cases.slotOpen')}
            </div>
            <div style={{ marginTop: 8 }}>
              <BTCta locale={locale} />
            </div>
          </div>
        </div>

        <div style={{ padding: '28px 0 48px' }} />
      </BTContainer>
    </div>
  );
}
