import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  label?: string;
  kind?: 'default' | 'hi';
  className?: string;
}

export function BTBox({ children, label, kind = 'default', className = '' }: Props) {
  const isHi = kind === 'hi';

  return (
    <div
      style={{
        position: 'relative',
        border: '2px solid var(--color-ink, #0A0A0A)',
        backgroundColor: isHi ? 'var(--color-ink, #0A0A0A)' : 'var(--color-paper, #F2F0E8)',
        color: isHi ? 'var(--color-bg, #E8E6DD)' : 'var(--color-ink, #0A0A0A)',
        padding: '16px',
        marginBottom: '14px',
      }}
      className={className}
    >
      {label && (
        <span
          style={{
            position: 'absolute',
            top: '-9px',
            left: '12px',
            backgroundColor: isHi ? 'var(--color-ink, #0A0A0A)' : 'var(--color-bg, #E8E6DD)',
            color: isHi ? 'var(--color-bg, #E8E6DD)' : 'var(--color-ink, #0A0A0A)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0 4px',
            lineHeight: '18px',
          }}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
