import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/auth/logout-button';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';

export async function DashboardTopbar({ locale, label }: { locale: string; label: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header className="h-14 md:h-16 border-b border-[#374151] bg-[#0D0D0D] flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Mobile: show logo. Desktop: show page context (handled by sidebar) */}
      <div className="md:hidden">
        <span className="text-[#00E87A] text-xs font-mono font-bold tracking-widest">ZEROEN</span>
      </div>

      <div className="hidden md:block">
        <p className="text-[#6B7280] text-xs font-mono">
          {label}
        </p>
      </div>

      {/* Right: locale switcher + user info + logout */}
      <div className="flex items-center gap-3">
        <LocaleSwitcher />
        <div className="flex items-center gap-2">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-7 h-7 rounded-full border border-[#374151]"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#1F2937] border border-[#374151] flex items-center justify-center">
              <span className="text-[#00E87A] text-xs font-mono font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="hidden md:block text-[#F4F4F2] text-xs font-mono truncate max-w-[120px]">
            {displayName}
          </span>
        </div>
        <LogoutButton locale={locale} />
      </div>
    </header>
  );
}
