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
    title: locale === 'ja' ? 'スタートアップ向け — ZeroEn' : 'For Startups — ZeroEn',
    description: locale === 'ja'
      ? 'プレシード/シードの東京創業者向け。本番バイリンガル製品を数週間で。'
      : 'Pre-seed / seed founders in Tokyo. Production bilingual product in weeks.',
  };
}

type Deliverable = { title: string; desc: string };

export default async function StartupsPage({ params }: Props) {
  const { locale } = await params;
  const tMkt = await getTranslations('mkt');

  const h1Lines     = tMkt.raw('startups.h1') as string[];
  const deliverables = tMkt.raw('startups.deliverables') as Deliverable[];

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #E8E6DD)', minHeight: '100vh' }}>
      <BTContainer>
        {/* ── Hero ──────────────────────────────────────── */}
        <section style={{ padding: '28px 0 20px', borderBottom: '2px solid var(--color-ink, #0A0A0A)' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 9vw, 104px)',
            fontWeight: 800,
            margin: '0 0 14px',
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
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
          <p style={{
            fontSize: 'clamp(14px, 1.6vw, 17px)',
            fontWeight: 500,
            margin: 0,
            maxWidth: 640,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-ink, #0A0A0A)',
          }}>
            &gt; {tMkt('startups.sub')}
          </p>
        </section>

        {/* ── Deliverables ──────────────────────────────── */}
        <BTSectionHead
          label={tMkt('startups.deliverablesLabel')}
          heading={locale === 'ja' ? '3週間で届ける' : 'In three weeks'}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14,
          margin: '14px 0 28px',
        }}>
          {deliverables.map((d, i) => (
            <div
              key={i}
              className="bt-hover-shadow"
              style={{
                border: '2px solid var(--color-ink, #0A0A0A)',
                backgroundColor: 'var(--color-paper, #F2F0E8)',
                padding: '20px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                marginBottom: 10,
                color: 'var(--color-ink, #0A0A0A)',
              }}>
                {d.title}
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--color-ink, #0A0A0A)' }}>
                {d.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Founder math ──────────────────────────────── */}
        <BTSectionHead
          label={locale === 'ja' ? '比較 // コスト' : 'COMPARE // COST'}
          heading={locale === 'ja' ? '¥1100万節約できる理由' : 'Save ¥11M. Here is why.'}
        />

        <BTBox kind="hi">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            <tbody>
              {(locale === 'ja'
                ? [
                    { label: 'JP代理店 (典型的)', cost: '¥800万–¥1000万', note: '4–6ヶ月', muted: true },
                    { label: 'フリーランサー', cost: '¥150万–¥300万', note: '2–4ヶ月', muted: true },
                    { label: 'ZeroEn Growth', cost: '¥88万', note: '21–28営業日', muted: false },
                    { label: 'ZeroEn Starter', cost: '¥38万', note: '14営業日', muted: false },
                  ]
                : [
                    { label: 'JP agency (typical)',  cost: '¥8M–¥10M',  note: '4–6 months',       muted: true },
                    { label: 'Freelancer',            cost: '¥1.5M–¥3M', note: '2–4 months',       muted: true },
                    { label: 'ZeroEn Growth',         cost: '¥880K',     note: '21–28 biz days',  muted: false },
                    { label: 'ZeroEn Starter',        cost: '¥380K',     note: '14 biz days',     muted: false },
                  ]
              ).map((row) => (
                <tr key={row.label} style={{
                  borderBottom: '1px dashed rgba(232,230,221,0.2)',
                  opacity: row.muted ? 0.45 : 1,
                }}>
                  <td style={{ padding: '10px 0', fontWeight: 700, color: row.muted ? 'inherit' : 'var(--color-bg, #E8E6DD)' }}>
                    {row.muted ? <s>{row.label}</s> : row.label}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: row.muted ? 'inherit' : 'var(--color-accent, #00E87A)', fontSize: 14 }}>
                    {row.cost}
                  </td>
                  <td style={{ padding: '10px 0 10px 12px', textAlign: 'right', color: 'rgba(232,230,221,0.5)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 16, fontSize: 24, fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--color-accent, #00E87A)', letterSpacing: '-0.02em' }}>
            {locale === 'ja' ? '最大 ¥1100万 節約' : 'SAVE UP TO ¥11M'}
          </div>
        </BTBox>

        {/* ── CTA ───────────────────────────────────────── */}
        <div style={{ padding: '8px 0 48px' }}>
          <BTCta locale={locale} />
        </div>
      </BTContainer>
    </div>
  );
}
