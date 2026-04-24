interface Props {
  label: string;
  heading: string;
  kicker?: string;
}

export function BTSectionHead({ label, heading, kicker }: Props) {
  return (
    <div style={{ padding: '28px 0 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--color-accent, #00E87A)',
            color: 'var(--color-ink, #0A0A0A)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '2px 6px',
            flexShrink: 0,
          }}
        >
          {label}
        </span>
        <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--color-ink, #0A0A0A)' }} />
      </div>
      {kicker && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-ink-dim, #5A584F)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          {kicker}
        </p>
      )}
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          lineHeight: '0.95',
          textTransform: 'uppercase',
          color: 'var(--color-ink, #0A0A0A)',
          margin: 0,
        }}
      >
        {heading}
      </h2>
    </div>
  );
}
