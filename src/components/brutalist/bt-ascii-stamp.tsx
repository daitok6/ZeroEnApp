interface Props {
  locale: string;
}

const CONTENT = {
  en: [
    'ZEROEN // IDEA → PAYING USERS',
    '● TYO · 2 SLOTS · MAY \'26',
  ],
  ja: [
    'ZEROEN // アイデアを、プロダクトに。',
    '● 東京 · 残枠2 · 2026年5月',
  ],
};

export function BTAsciiStamp({ locale }: Props) {
  const lines = locale === 'ja' ? CONTENT.ja : CONTENT.en;

  return (
    <div
      style={{
        display: 'inline-block',
        border: '3px double var(--color-accent, #00E87A)',
        padding: '10px 16px',
        margin: '0 0 16px 0',
      }}
    >
      {lines.map((line) => (
        <div
          key={line}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(9px, 1.8vw, 13px)',
            color: 'var(--color-accent, #00E87A)',
            lineHeight: 1.6,
            whiteSpace: 'nowrap',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}
