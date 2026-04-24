export function BTPulse() {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: '8px', height: '8px', flexShrink: 0 }}>
      {/* outer ring */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent, #00E87A)',
          animation: 'btpulse 1.8s ease-out infinite',
        }}
      />
      {/* inner solid dot */}
      <span
        style={{
          position: 'absolute',
          inset: '1px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent, #00E87A)',
        }}
      />
    </span>
  );
}
