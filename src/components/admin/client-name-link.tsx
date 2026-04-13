import Link from 'next/link';

interface ClientNameLinkProps {
  clientId: string;
  name?: string | null;
  email?: string | null;
  locale: string;
  className?: string;
}

export function ClientNameLink({ clientId, name, email, locale, className }: ClientNameLinkProps) {
  const label = name ?? email ?? clientId;
  return (
    <Link
      href={`/${locale}/admin/clients/${clientId}`}
      className={`hover:text-[#00E87A] transition-colors underline-offset-2 hover:underline ${className ?? ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      {label}
    </Link>
  );
}
