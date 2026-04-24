interface Props {
  locale: string;
}

const STAMP = {
  en: [
    '+--------------------------------------+',
    '| ZEROEN // IDEA -> PAYING USERS       |',
    '| * TYO . 2 SLOTS . MAY \'26           |',
    '+--------------------------------------+',
  ],
  ja: [
    '+--------------------------------------+',
    '| ZEROEN // アイデアを、プロダクトに。  |',
    '| * 東京 . 残枠2 . 2026年5月           |',
    '+--------------------------------------+',
  ],
};

export function BTAsciiStamp({ locale }: Props) {
  const lines = locale === 'ja' ? STAMP.ja : STAMP.en;

  return (
    <pre
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(9px, 1.8vw, 13px)',
        color: 'var(--color-accent, #00E87A)',
        lineHeight: 1.4,
        margin: '0 0 16px 0',
        overflowX: 'auto',
      }}
    >
      {lines.join('\n')}
    </pre>
  );
}
