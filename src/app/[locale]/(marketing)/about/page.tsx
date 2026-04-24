import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BTContainer } from '@/components/brutalist/bt-container';
import { BTSectionHead } from '@/components/brutalist/bt-section-head';
import { BTBox } from '@/components/brutalist/bt-box';
import { BTCta } from '@/components/brutalist/bt-cta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja'
      ? 'ZeroEnについて — 元日立・元楽天エンジニア'
      : 'About ZeroEn — Ex-Hitachi, Ex-Rakuten Engineer',
    description: locale === 'ja'
      ? '東京のソロバイリンガルエンジニア。JP代理店の4ヶ月・¥800万を、3週間・¥88万で置き換える。'
      : 'Solo bilingual engineer in Tokyo. Replacing the JP agency 4-month ¥8M engagement with 3 weeks at ¥880K.',
  };
}

type Credential = { org: string; role: string; span: string };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const tMkt = await getTranslations('mkt');

  const h1Lines   = tMkt.raw('about.h1') as string[];
  const bodyLines = tMkt.raw('about.body') as string[];
  const creds     = tMkt.raw('about.credentials') as Credential[];

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #E8E6DD)', minHeight: '100vh' }}>
      <BTContainer>
        {/* ── Hero ──────────────────────────────────────── */}
        <section style={{ padding: '28px 0 20px', borderBottom: '2px solid var(--color-ink, #0A0A0A)' }}>
          <div style={{
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-dim, #5A584F)',
            marginBottom: 12,
            fontFamily: 'var(--font-mono)',
          }}>
            {tMkt('about.eyebrow')}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 4.5vw, 52px)',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.02,
            letterSpacing: '-0.025em',
            textTransform: 'uppercase',
            color: 'var(--color-ink, #0A0A0A)',
          }}>
            {h1Lines.map((line, i) => (
              <span key={i} style={{ display: 'block' }}>
                {i === 1
                  ? <span style={{ backgroundColor: 'var(--color-accent, #00E87A)', padding: '0 6px' }}>{line}</span>
                  : line}
              </span>
            ))}
          </h1>
        </section>

        {/* ── Manifesto body ────────────────────────────── */}
        <div style={{ padding: '24px 0', maxWidth: 760, fontFamily: 'var(--font-mono)' }}>
          {bodyLines.map((b, i) => (
            <p key={i} style={{
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              lineHeight: 1.65,
              margin: '0 0 16px',
              color: 'var(--color-ink, #0A0A0A)',
            }}>
              &gt; {b}
            </p>
          ))}
        </div>

        {/* ── CV table ──────────────────────────────────── */}
        <BTSectionHead
          label={tMkt('about.cvLabel')}
          heading={locale === 'ja' ? '経歴' : 'THE RESUME'}
        />

        <BTBox>
          {creds.map((c, i) => (
            <div key={c.org} style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr auto',
              gap: 14,
              padding: '12px 0',
              borderBottom: i < creds.length - 1 ? '1px dashed var(--color-ink, #0A0A0A)' : 'none',
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              alignItems: 'baseline',
              color: 'var(--color-ink, #0A0A0A)',
            }}>
              <span style={{
                fontWeight: 900,
                textTransform: 'uppercase',
                fontSize: 15,
                color: i === creds.length - 1 ? 'var(--color-accent, #00E87A)' : 'var(--color-ink, #0A0A0A)',
              }}>
                {c.org}
              </span>
              <span>{c.role}</span>
              <span style={{ color: 'var(--color-ink-dim, #5A584F)', fontSize: 11, letterSpacing: '0.1em' }}>
                {c.span}
              </span>
            </div>
          ))}
        </BTBox>

        {/* ── CTA ───────────────────────────────────────── */}
        <div style={{ padding: '20px 0 48px' }}>
          <BTCta locale={locale} />
        </div>
      </BTContainer>
    </div>
  );
}
