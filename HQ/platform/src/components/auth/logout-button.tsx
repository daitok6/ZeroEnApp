'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton({ locale }: { locale: string }) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#F4F4F2] text-xs font-mono transition-colors p-2 rounded hover:bg-[#1F2937]"
      aria-label="Log out"
    >
      <LogOut size={14} />
      <span className="hidden md:inline">
        {locale === 'ja' ? 'ログアウト' : 'Log out'}
      </span>
    </button>
  );
}
