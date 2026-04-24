import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BTContainer } from '@/components/brutalist/bt-container';
import { BookPicker } from './book-picker';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja' ? 'スコープ通話を予約 — ZeroEn' : 'Book Scoping Call — ZeroEn',
    description: locale === 'ja'
      ? '30分の通話。コミットメント不要。48時間以内に固定価格の提案をお届けします。'
      : '30-minute call. No commitment. Fixed-price proposal within 48 hours.',
  };
}

export default async function BookPage({ params }: Props) {
  const { locale } = await params;
  const tMkt = await getTranslations('mkt');

  const h1Lines = tMkt.raw('book.h1') as string[];

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #E8E6DD)', minHeight: '100vh' }}>
      <BTContainer>
        {/* ── Hero ──────────────────────────────────────── */}
        <section style={{ padding: '28px 0 20px', borderBottom: '2px solid var(--color-ink, #0A0A0A)' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 7vw, 88px)',
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
            fontSize: 'clamp(14px, 1.6vw, 16px)',
            fontWeight: 700,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--color-ink-dim, #5A584F)',
            fontFamily: 'var(--font-mono)',
          }}>
            &gt; {tMkt('book.sub')}
          </p>
        </section>

        {/* ── Picker (client) ───────────────────────────── */}
        <BookPicker
          locale={locale}
          dayLabel={tMkt('book.dayLabel')}
          timeLabel={tMkt('book.timeLabel')}
          confirmCta={tMkt('book.confirmCta')}
          confirmNote={locale === 'ja'
            ? 'メールクライアントが開きます。送信して完了。'
            : 'Opens your email client. Hit send to confirm.'}
        />

        <div style={{ padding: '28px 0 48px' }} />
      </BTContainer>
    </div>
  );
}
