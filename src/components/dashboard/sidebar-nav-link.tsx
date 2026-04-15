'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface SidebarNavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  exact?: boolean;
  badge?: ReactNode;
  locked?: boolean;
}

export function SidebarNavLink({ href, icon: Icon, label, exact = false, badge, locked = false }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = !locked && (exact ? pathname === href : pathname.startsWith(href));

  if (locked) {
    return (
      <div
        title="Available once your project is ready"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono opacity-35 cursor-not-allowed select-none"
      >
        <Icon size={16} strokeWidth={1.5} />
        <span className="flex-1">{label}</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-colors ${
        isActive
          ? 'bg-[#00E87A]/10 text-[#00E87A] border border-[#00E87A]/20'
          : 'text-[#9CA3AF] hover:text-[#F4F4F2] hover:bg-[#1F2937]'
      }`}
    >
      <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
      <span className="flex-1">{label}</span>
      {badge}
    </Link>
  );
}
