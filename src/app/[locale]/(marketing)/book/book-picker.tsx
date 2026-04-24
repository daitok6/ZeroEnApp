'use client';

import { useState } from 'react';
import { BTBox } from '@/components/brutalist/bt-box';

const TIMES = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
const DAYS  = [24, 25, 26, 27, 28, 29, 30];
const DAY_LABELS_EN = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAY_LABELS_JA = ['月', '火', '水', '木', '金', '土', '日'];

interface Props {
  locale: string;
  dayLabel: string;
  timeLabel: string;
  confirmCta: string;
  confirmNote: string;
}

export function BookPicker({ locale, dayLabel, timeLabel, confirmCta, confirmNote }: Props) {
  const [day, setDay]   = useState(2);
  const [time, setTime] = useState(2);
  const [sent, setSent] = useState(false);

  const dayLabels = locale === 'ja' ? DAY_LABELS_JA : DAY_LABELS_EN;

  function handleConfirm() {
    const subject = encodeURIComponent('Scoping call booking');
    const body = encodeURIComponent(
      `Day: May ${DAYS[day]}\nTime (JST): ${TIMES[time]}\n\n---\nProject overview:\n`
    );
    window.location.href = `mailto:daito@zeroen.dev?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <BTBox kind="hi">
        <div style={{ padding: '16px 0', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--color-accent, #00E87A)' }}>
          {locale === 'ja' ? '✓ メールクライアントを開きました' : '✓ EMAIL CLIENT OPENED'}
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, margin: '8px 0 0', color: 'var(--color-bg, #E8E6DD)' }}>
          {locale === 'ja'
            ? '送信してください。24時間以内に確認します。'
            : 'Send it. We confirm within 24 hours.'}
        </p>
      </BTBox>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginTop: 24 }}>
      {/* Day picker */}
      <BTBox label={dayLabel}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, fontFamily: 'var(--font-mono)' }}>
          {dayLabels.map((d) => (
            <div key={d} style={{ fontSize: 10, fontWeight: 700, textAlign: 'center', padding: '4px 0', color: 'var(--color-ink-dim, #5A584F)', letterSpacing: '0.08em' }}>
              {d}
            </div>
          ))}
          {DAYS.map((d, i) => (
            <button
              key={d}
              onClick={() => setDay(i)}
              style={{
                textAlign: 'center',
                padding: '14px 0',
                border: '2px solid var(--color-ink, #0A0A0A)',
                fontWeight: 900,
                fontSize: 16,
                backgroundColor: day === i ? 'var(--color-accent, #00E87A)' : 'var(--color-paper, #F2F0E8)',
                color: 'var(--color-ink, #0A0A0A)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                boxShadow: day === i ? '3px 3px 0 var(--color-ink, #0A0A0A)' : 'none',
                transition: 'box-shadow 0.08s, transform 0.08s',
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </BTBox>

      {/* Time picker */}
      <BTBox label={timeLabel}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8, fontFamily: 'var(--font-mono)' }}>
          {TIMES.map((t, i) => (
            <button
              key={t}
              onClick={() => setTime(i)}
              style={{
                padding: '12px 14px',
                border: '2px solid var(--color-ink, #0A0A0A)',
                fontSize: 14,
                fontWeight: 900,
                backgroundColor: time === i ? 'var(--color-accent, #00E87A)' : 'var(--color-paper, #F2F0E8)',
                color: 'var(--color-ink, #0A0A0A)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                boxShadow: time === i ? '3px 3px 0 var(--color-ink, #0A0A0A)' : 'none',
                transition: 'box-shadow 0.08s, transform 0.08s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </BTBox>

      {/* Confirmation box */}
      <BTBox kind="hi">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-bg, #E8E6DD)' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(232,230,221,0.6)', marginBottom: 4 }}>
              {locale === 'ja' ? '選択中' : 'SELECTED'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.01em' }}>
              MAY {DAYS[day]} · {TIMES[time]} JST
            </div>
          </div>
          <button
            onClick={handleConfirm}
            className="bt-hover-shadow"
            style={{
              backgroundColor: 'var(--color-accent, #00E87A)',
              color: 'var(--color-ink, #0A0A0A)',
              border: '2px solid var(--color-bg, #E8E6DD)',
              padding: '12px 20px',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            ► {confirmCta}
          </button>
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(232,230,221,0.5)', margin: '12px 0 0', letterSpacing: '0.06em' }}>
          {confirmNote}
        </p>
      </BTBox>
    </div>
  );
}
