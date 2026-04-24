export function TerminalWindow({ children, title, className }: { children: React.ReactNode; title?: string; className?: string }) {
  return (
    <div className={className} style={{ fontFamily: 'var(--font-mono)', border: '2px solid var(--color-ink, #0A0A0A)', padding: '16px' }}>
      {title && <div style={{ marginBottom: '8px', opacity: 0.6 }}>{title}</div>}
      {children}
    </div>
  );
}
