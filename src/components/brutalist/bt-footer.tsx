import { Link } from '@/i18n/navigation';
import { BTPulse } from './bt-pulse';

interface Props {
  locale: string;
}

const LINKS = {
  en: [
    { href: '/',             label: 'Home' },
    { href: '/pricing',      label: 'Pricing' },
    { href: '/how-it-works', label: 'How it works' },
    { href: '/startups',     label: 'Startups' },
    { href: '/cases',        label: 'Cases' },
    { href: '/about',        label: 'About' },
    { href: '/login',        label: 'Log in' },
  ],
  ja: [
    { href: '/',             label: 'ホーム' },
    { href: '/pricing',      label: '料金' },
    { href: '/how-it-works', label: '進め方' },
    { href: '/startups',     label: 'スタートアップ' },
    { href: '/cases',        label: '実績' },
    { href: '/about',        label: '私について' },
    { href: '/login',        label: 'ログイン' },
  ],
};

export function BTFooter({ locale }: Props) {
  const links = locale === 'ja' ? LINKS.ja : LINKS.en;
  const tagline = locale === 'ja' ? 'アイデアを、プロダクトに。' : 'From idea to paying users.';
  const footerLeft = '// 2026 ZEROEN';
  const footerRight = locale === 'ja' ? '東京_JP' : 'TYO_JP';
  const labels = locale === 'ja'
    ? { sitemap: 'サイトマップ', contact: 'お問い合わせ', status: 'ステータス', operational: '稼働中' }
    : { sitemap: 'SITEMAP', contact: 'CONTACT', status: 'STATUS', operational: 'OPERATIONAL' };

  return (
    <footer
      aria-label="Site footer"
      style={{
        borderTop: '2px solid var(--color-ink, #0A0A0A)',
        backgroundColor: 'var(--color-paper, #F2F0E8)',
        marginTop: '40px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px 16px' }}>
        {/* 4-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* 1. Logo + tagline */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '6px',
                color: 'var(--color-ink, #0A0A0A)',
              }}
            >
              ZERO
              <span style={{ color: 'var(--color-accent, #00E87A)' }}>EN</span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-ink-dim, #5A584F)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {tagline}
            </p>
          </div>

          {/* 2. Sitemap */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-dim, #5A584F)',
                marginBottom: '10px',
              }}
            >
              {labels.sitemap}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href as '/'}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-ink, #0A0A0A)',
                      textDecoration: 'none',
                    }}
                    className="bt-link"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-dim, #5A584F)',
                marginBottom: '10px',
              }}
            >
              {labels.contact}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { href: 'mailto:daito@zeroen.dev', label: 'daito@zeroen.dev' },
                { href: 'https://twitter.com/zeroen', label: 'twitter.com/zeroen' },
                { href: 'https://github.com/zeroen', label: 'github.com/zeroen' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-ink, #0A0A0A)',
                      textDecoration: 'none',
                    }}
                    className="bt-link"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Status */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-dim, #5A584F)',
                marginBottom: '10px',
              }}
            >
              {labels.status}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <BTPulse />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink, #0A0A0A)',
                }}
              >
                {labels.operational}
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--color-ink-dim, #5A584F)',
              }}
            >
              99.98% · 30d
            </span>
          </div>
        </div>

        {/* Bottom rule */}
        <div style={{ borderTop: '1px dashed var(--color-ink, #0A0A0A)', paddingTop: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-ink-dim, #5A584F)',
              letterSpacing: '0.1em',
            }}
          >
            <span>{footerLeft}</span>
            <span>{footerRight}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
