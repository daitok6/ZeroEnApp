import { requireApproved } from '@/lib/auth/require-approved';
import { BillingClient } from '@/components/dashboard/billing-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function BillingPage({ params }: Props) {
  const { locale } = await params;
  const { user, supabase } = await requireApproved(locale);

  const { data: project } = await supabase
    .from('projects')
    .select('id, plan_tier, commitment_starts_at, stripe_subscription_id, site_url, status, pending_plan_tier, pending_plan_effective_at, stripe_subscription_schedule_id')
    .eq('client_id', user.id)
    .maybeSingle();

  const isJa = locale === 'ja';

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {isJa ? 'お支払い・プラン管理' : 'Billing & Plan'}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {isJa ? 'サブスクリプションの管理' : 'Manage your subscription'}
        </p>
      </div>

      <BillingClient
        planTier={project?.plan_tier ?? null}
        commitmentStartsAt={project?.commitment_starts_at ?? null}
        stripeSubscriptionId={project?.stripe_subscription_id ?? null}
        projectStatus={project?.status ?? null}
        pendingPlanTier={project?.pending_plan_tier ?? null}
        pendingPlanEffectiveAt={project?.pending_plan_effective_at ?? null}
        stripeSubscriptionScheduleId={project?.stripe_subscription_schedule_id ?? null}
        locale={locale}
      />
    </div>
  );
}
