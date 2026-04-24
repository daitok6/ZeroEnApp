'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { BTPulse } from './bt-pulse';

export function BTStatusBar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [time, setTime] = useState('');

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString('ja-JP', {
          timeZone: 'Asia/Tokyo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function switchLocale(next: 'en' | 'ja') {
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-ink, #0A0A0A)',
        color: 'var(--color-bg, #E8E6DD)',
        padding: '4px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      {/* Left: pulse + clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BTPulse />
        <span>TYO · {time} · JST</span>
      </div>

      {/* Right: version + locale toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'var(--color-ink-dim, #5A584F)' }}>/v4.2.0</span>
        {(['en', 'ja'] as const).map((lng) => (
          <button
            key={lng}
            onClick={() => switchLocale(lng)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '1px 5px',
              border: '1px solid var(--color-bg, #E8E6DD)',
              cursor: 'pointer',
              backgroundColor: locale === lng ? 'var(--color-bg, #E8E6DD)' : 'transparent',
              color: locale === lng ? 'var(--color-ink, #0A0A0A)' : 'var(--color-bg, #E8E6DD)',
              transition: 'background-color 0.08s, color 0.08s',
            }}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
