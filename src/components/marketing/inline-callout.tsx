import Link from 'next/link';
import type { JSX } from 'react';

interface Props {
  eyebrow: string;
  title: string;
  href: string;
  external?: boolean;
}

export function InlineCallout({ eyebrow, title, href, external }: Props): JSX.Element {
  const linkProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <div className="border-l-2 border-[#00E87A]/40 pl-4 py-1 my-6">
      <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-1">
        {eyebrow}
      </p>
      {external ? (
        <a
          href={href}
          className="text-[#9CA3AF] font-mono text-sm hover:text-[#00E87A] transition-colors duration-150"
          {...linkProps}
        >
          {title} →
        </a>
      ) : (
        <Link
          href={href}
          className="text-[#9CA3AF] font-mono text-sm hover:text-[#00E87A] transition-colors duration-150"
        >
          {title} →
        </Link>
      )}
    </div>
  );
}
