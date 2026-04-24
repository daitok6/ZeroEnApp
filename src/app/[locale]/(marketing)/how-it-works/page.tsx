import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BTContainer } from '@/components/brutalist/bt-container';
import { BTSectionHead } from '@/components/brutalist/bt-section-head';
import { BTCta } from '@/components/brutalist/bt-cta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja' ? '進め方 — ZeroEn' : 'How It Works — ZeroEn',
    description: locale === 'ja'
      ? '5ステップ。スコープ通話からローンチまで。固定価格、固定スコープ。'
      : '5 steps. Scoping call to launch. Fixed price, locked scope.',
  };
}

type Step = { n: string; name: string; eta: string; desc: string };

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  const tMkt = await getTranslations('mkt');

  const steps = tMkt.raw('how.steps') as Step[];

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #E8E6DD)', minHeight: '100vh' }}>
      <BTContainer>
        {/* ── Hero ──────────────────────────────────────── */}
        <section style={{ padding: '28px 0 20px', borderBottom: '2px solid var(--color-ink, #0A0A0A)' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 7vw, 84px)',
            fontWeight: 800,
            margin: '0 0 12px',
            lineHeight: 0.92,
            letterSpacing: '-0.035em',
            textTransform: 'uppercase',
            color: 'var(--color-ink, #0A0A0A)',
          }}>
            {tMkt('how.h1')}
          </h1>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-dim, #5A584F)',
            fontFamily: 'var(--font-mono)',
          }}>
            &gt; {tMkt('how.sub')}
          </div>
        </section>

        {/* ── Steps ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, padding: '28px 0' }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'flex-start' }}>
              {/* left: badge + connector line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 58,
                  height: 58,
                  border: '2px solid var(--color-ink, #0A0A0A)',
                  backgroundColor: 'var(--color-accent, #00E87A)',
                  color: 'var(--color-ink, #0A0A0A)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 22,
                  fontFamily: 'var(--font-display)',
                  boxShadow: '4px 4px 0 var(--color-ink, #0A0A0A)',
                  flexShrink: 0,
                }}>
                  {s.n}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 2, flex: 1, backgroundColor: 'var(--color-ink, #0A0A0A)', minHeight: 30 }} />
                )}
              </div>

              {/* right: card */}
              <div
                className="bt-hover-shadow"
                style={{
                  border: '2px solid var(--color-ink, #0A0A0A)',
                  backgroundColor: 'var(--color-paper, #F2F0E8)',
                  padding: '16px 20px',
                  fontFamily: 'var(--font-mono)',
                  minWidth: 0,
                  marginBottom: i < steps.length - 1 ? 0 : 0,
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                  gap: 10,
                  flexWrap: 'wrap',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 20,
                    letterSpacing: '-0.015em',
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    flex: '1 1 auto',
                    minWidth: 0,
                    color: 'var(--color-ink, #0A0A0A)',
                  }}>
                    {s.name}
                  </div>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: '0.14em',
                    backgroundColor: 'var(--color-ink, #0A0A0A)',
                    color: 'var(--color-bg, #E8E6DD)',
                    padding: '4px 8px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    alignSelf: 'flex-start',
                  }}>
                    {s.eta}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--color-ink, #0A0A0A)' }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA strip ─────────────────────────────────── */}
        <BTSectionHead label="NEXT" heading={locale === 'ja' ? '準備できたら、話しましょう。' : "Ready? Let's talk."} />
        <div style={{ padding: '20px 0 48px' }}>
          <BTCta locale={locale} />
        </div>
      </BTContainer>
    </div>
  );
}
