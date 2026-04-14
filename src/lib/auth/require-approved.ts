import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Guards a dashboard page to active clients only.
 * Non-client users are redirected to the dashboard overview.
 * Unauthenticated users are redirected to login.
 */
export async function requireApproved(locale: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  if (profile?.status !== 'client') {
    redirect(`/${locale}/dashboard`);
  }

  return { user, supabase };
}
