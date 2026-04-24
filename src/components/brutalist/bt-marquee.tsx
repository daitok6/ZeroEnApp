interface Props {
  locale: string;
}

const ITEMS_EN = [
  '● MRR $0→GROWING',
  '// 2 SLOTS OPEN',
  '// UPTIME 99.98%',
  '// LIGHTHOUSE 98',
  '● NEXT.JS + SUPABASE + STRIPE',
  '// FIXED PRICE',
  '// SHIPS IN WEEKS',
  '// BILINGUAL FROM DAY ONE',
];

const ITEMS_JA = [
  '● MRR 成長中',
  '// 残り2枠',
  '// 稼働率 99.98%',
  '// Lighthouse 98点',
  '● Next.js + Supabase + Stripe',
  '// 固定価格',
  '// 数週間で納品',
  '// 初日からバイリンガル',
];

export function BTMarquee({ locale }: Props) {
  const items = locale === 'ja' ? ITEMS_JA : ITEMS_EN;
  // Double the items for a seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        backgroundColor: 'var(--color-accent, #00E87A)',
        color: 'var(--color-ink, #0A0A0A)',
        overflow: 'hidden',
        borderBottom: '2px solid var(--color-ink, #0A0A0A)',
        padding: '5px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: 'btmarquee 40s linear infinite',
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              padding: '0 24px',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
