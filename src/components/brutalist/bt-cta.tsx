import { Link } from '@/i18n/navigation';

interface Props {
  locale: string;
  label?: string;
  note?: string;
  href?: string;
}

const CAL_URL: Record<string, string> = {
  ja: 'https://cal.com/zeroen/scoping-call-ja',
  en: 'https://cal.com/zeroen/scoping-call',
};

export function BTCta({
  locale,
  label,
  note,
  href,
}: Props) {
  const resolvedHref = href ?? CAL_URL[locale] ?? CAL_URL.en;
  const ctaLabel = label ?? (locale === 'ja' ? 'スコープ通話を予約' : 'BOOK SCOPING CALL');
  const ctaNote  = note  ?? (locale === 'ja' ? '30分 · 48時間以内に提案' : '30 MIN · PROPOSAL IN 48 H');

  const isExternal = resolvedHref.startsWith('mailto:') || resolvedHref.startsWith('http');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
      {isExternal ? (
        <a
          href={resolvedHref}
          target="_blank"
          rel="noopener noreferrer"
          className="bt-hover-shadow"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-accent, #00E87A)',
            color: 'var(--color-ink, #0A0A0A)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: '2px solid var(--color-ink, #0A0A0A)',
            boxShadow: '4px 4px 0 var(--color-ink, #0A0A0A)',
            padding: '10px 18px',
            whiteSpace: 'nowrap',
          }}
        >
          <span aria-hidden="true">►</span> {ctaLabel}
        </a>
      ) : (
        <Link
          href={href as '/'}
          className="bt-hover-shadow"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-accent, #00E87A)',
            color: 'var(--color-ink, #0A0A0A)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: '2px solid var(--color-ink, #0A0A0A)',
            boxShadow: '4px 4px 0 var(--color-ink, #0A0A0A)',
            padding: '10px 18px',
            whiteSpace: 'nowrap',
          }}
        >
          <span aria-hidden="true">►</span> {ctaLabel}
        </Link>
      )}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--color-ink-dim, #5A584F)',
          letterSpacing: '0.1em',
        }}
      >
        {ctaNote}
      </span>
    </div>
  );
}
