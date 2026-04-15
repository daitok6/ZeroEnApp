import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface DashboardProfile {
  status: string;
  onboarding_status: string | null;
  onboarding_progress: Record<string, unknown>;
}

export interface DashboardProject {
  id: string;
  client_visible: boolean | null;
  plan_tier: string | null;
  status: string | null;
  site_url: string | null;
  checkout_pending_at: string | null;
  commitment_starts_at: string | null;
  name: string | null;
  description: string | null;
  github_repo: string | null;
  vercel_project: string | null;
  created_at: string | null;
}

export interface DashboardSession {
  user: { id: string; email?: string };
  profile: DashboardProfile | null;
  project: DashboardProject | null;
  supabase: Awaited<ReturnType<typeof createClient>>;
}

/**
 * Returns the authenticated user, their profile, and their project for the
 * current request. Wrapped in React.cache so multiple layouts/pages calling
 * this in the same request share a single Supabase round-trip.
 */
export const getDashboardSession = cache(async (locale: string): Promise<DashboardSession> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  const [{ data: profile }, { data: project }] = await Promise.all([
    supabase
      .from('profiles')
      .select('status, onboarding_status, onboarding_progress')
      .eq('id', user.id)
      .single(),
    supabase
      .from('projects')
      .select('id, client_visible, plan_tier, status, site_url, checkout_pending_at, commitment_starts_at, name, description, github_repo, vercel_project, created_at')
      .eq('client_id', user.id)
      .maybeSingle(),
  ]);

  return {
    user,
    profile: profile
      ? {
          status: profile.status,
          onboarding_status: profile.onboarding_status,
          onboarding_progress: (profile.onboarding_progress ?? {}) as Record<string, unknown>,
        }
      : null,
    project: project ?? null,
    supabase,
  };
});
