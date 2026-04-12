import type { SupabaseClient } from '@supabase/supabase-js';
import type { NewTask } from '../types';

type CadenceRule = (date: Date, db: SupabaseClient) => Promise<NewTask[]>;

// YYYY-MM-DD
function fmt(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Add days to a date
function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// ── Rule 1: Monthly analytics report (1st of month, due 5th) ─────────────────
const monthlyReport: CadenceRule = async (date, db) => {
  if (date.getDate() !== 1) return [];

  const { data: projects } = await db
    .from('projects')
    .select('id, name, client_id')
    .in('status', ['operating', 'launched']);

  return (projects ?? []).map((p: { id: string; name: string; client_id: string }) => ({
    title: `Send analytics report — ${p.name}`,
    kind: 'cadence' as const,
    rule_key: 'monthly_report',
    client_id: p.client_id,
    related_table: 'projects',
    related_id: p.id,
    due_date: fmt(addDays(date, 4)), // due 5th
    urgency: 'high' as const,
    category: 'client_ops' as const,
    dedupe_key: `cadence:monthly_report:${fmt(date)}:${p.id}`,
  }));
};

// ── Rule 2: Billing verification — Coconala clients (1st of month) ────────────
const billingVerifyCoconala: CadenceRule = async (date, db) => {
  if (date.getDate() !== 1) return [];

  const { data: profiles } = await db
    .from('profiles')
    .select('id, full_name, email')
    .eq('source', 'coconala')
    .eq('role', 'client');

  if (!profiles || profiles.length === 0) return [];

  const clientIds = profiles.map((p: { id: string }) => p.id);
  const { data: projects } = await db
    .from('projects')
    .select('id, client_id')
    .in('client_id', clientIds)
    .in('status', ['operating', 'launched']);

  const activeClientIds = new Set((projects ?? []).map((p: { client_id: string }) => p.client_id));
  const activeProfiles = profiles.filter((p: { id: string }) => activeClientIds.has(p.id));

  return activeProfiles.map((p: { id: string; full_name: string | null; email: string }) => ({
    title: `Verify Coconala billing — ${p.full_name ?? p.email}`,
    kind: 'cadence' as const,
    rule_key: 'billing_verify_coconala',
    client_id: p.id,
    due_date: fmt(addDays(date, 4)),
    urgency: 'normal' as const,
    category: 'billing' as const,
    dedupe_key: `cadence:billing_verify_coconala:${fmt(date)}:${p.id}`,
  }));
};

// ── Rule 3: Billing verification — Stripe clients (1st of month) ─────────────
const billingVerifyStripe: CadenceRule = async (date, db) => {
  if (date.getDate() !== 1) return [];

  const { data: projects } = await db
    .from('projects')
    .select('id, name, client_id, profiles!projects_client_id_fkey(id, full_name, email, source)')
    .in('status', ['operating', 'launched'])
    .not('stripe_subscription_id', 'is', null);

  return (projects ?? [])
    .filter((p: { profiles: { source: string } | { source: string }[] | null }) => {
      const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
      return profile?.source !== 'coconala';
    })
    .map((p: { id: string; name: string; client_id: string; profiles: { id: string; full_name: string | null; email: string } | { id: string; full_name: string | null; email: string }[] | null }) => {
      return {
        title: `Verify Stripe billing — ${p.name}`,
        kind: 'cadence' as const,
        rule_key: 'billing_verify_stripe',
        client_id: p.client_id,
        related_table: 'projects',
        related_id: p.id,
        due_date: fmt(addDays(date, 4)),
        urgency: 'normal' as const,
        category: 'billing' as const,
        dedupe_key: `cadence:billing_verify_stripe:${fmt(date)}:${p.id}`,
      };
    });
};

// ── Rule 4: Mid-month client health check (15th) ──────────────────────────────
const midMonthHealth: CadenceRule = async (date, db) => {
  if (date.getDate() !== 15) return [];

  const { data: projects } = await db
    .from('projects')
    .select('id, name, client_id')
    .in('status', ['operating', 'launched', 'building', 'onboarding']);

  return (projects ?? []).map((p: { id: string; name: string; client_id: string }) => ({
    title: `Health check — ${p.name}`,
    kind: 'cadence' as const,
    rule_key: 'mid_month_health',
    client_id: p.client_id,
    related_table: 'projects',
    related_id: p.id,
    due_date: fmt(date),
    urgency: 'normal' as const,
    category: 'client_ops' as const,
    dedupe_key: `cadence:mid_month_health:${fmt(date)}:${p.id}`,
  }));
};

// ── Rule 5: Weekly content pipeline review (Monday) ──────────────────────────
const weeklyContentReview: CadenceRule = async (date) => {
  if (date.getDay() !== 1) return []; // 1 = Monday

  return [{
    title: 'Weekly content pipeline review',
    kind: 'cadence' as const,
    rule_key: 'weekly_content_review',
    due_date: fmt(date),
    urgency: 'normal' as const,
    category: 'content' as const,
    dedupe_key: `cadence:weekly_content_review:${fmt(date)}`,
  }];
};

// ── Rule 6: Daily marketing trigger check ────────────────────────────────────
const dailyMarketingTrigger: CadenceRule = async (date) => {
  return [{
    title: 'Daily marketing trigger check',
    kind: 'cadence' as const,
    rule_key: 'daily_marketing_trigger',
    due_date: fmt(date),
    urgency: 'low' as const,
    category: 'marketing' as const,
    dedupe_key: `cadence:daily_marketing_trigger:${fmt(date)}`,
  }];
};

export const CADENCE_RULES: CadenceRule[] = [
  monthlyReport,
  billingVerifyCoconala,
  billingVerifyStripe,
  midMonthHealth,
  weeklyContentReview,
  dailyMarketingTrigger,
];
