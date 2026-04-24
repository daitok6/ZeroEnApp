export function CaseGrid({ children, locale: _ }: { children?: React.ReactNode; locale?: string }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>{children}</div>;
}
