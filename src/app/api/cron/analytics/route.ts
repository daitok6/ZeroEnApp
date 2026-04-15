import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

interface UmamiStats {
  pageviews: { value: number; prev: number };
  visitors: { value: number; prev: number };
  bounces: { value: number; prev: number };
  totaltime: { value: number; prev: number };
}

interface UmamiMetric {
  x: string;
  y: number;
}

function getPreviousMonthRange() {
  const now = new Date();
  const year = now.getUTCMonth() === 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear();
  const month = now.getUTCMonth() === 0 ? 11 : now.getUTCMonth() - 1;

  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  return {
    startAt: start.getTime(),
    endAt: end.getTime(),
    periodStart: start.toISOString().split('T')[0],
    periodEnd: end.toISOString().split('T')[0],
  };
}

async function getUmamiToken(): Promise<string> {
  const base = process.env.UMAMI_API_URL;
  const username = process.env.UMAMI_USERNAME;
  const password = process.env.UMAMI_PASSWORD;
  if (!base || !username || !password) {
    throw new Error('UMAMI_API_URL, UMAMI_USERNAME, or UMAMI_PASSWORD not set');
  }
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error(`Umami login failed: ${res.status}`);
  const data = await res.json() as { token: string };
  return data.token;
}

async function umamiGet<T>(path: string, token: string): Promise<T> {
  const base = process.env.UMAMI_API_URL;
  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Umami ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const projectId = req.nextUrl.searchParams.get('projectId');
  const source: 'cron' | 'manual' = projectId ? 'manual' : 'cron';

  let query = supabase
    .from('projects')
    .select('id, umami_website_id')
    .not('umami_website_id', 'is', null);

  if (projectId) {
    query = query.eq('id', projectId);
  } else {
    query = query.eq('status', 'operating');
  }

  const { data: projects, error: fetchError } = await query;
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!projects?.length) return NextResponse.json({ message: 'No projects to process', count: 0 });

  const { startAt, endAt, periodStart, periodEnd } = getPreviousMonthRange();
  const umamiToken = await getUmamiToken();

  const results: { projectId: string; ok: boolean; error?: string }[] = [];

  for (const project of projects) {
    try {
      const statsPath = `/api/websites/${project.umami_website_id}/stats?startAt=${startAt}&endAt=${endAt}`;
      const metricsPath = `/api/websites/${project.umami_website_id}/metrics?startAt=${startAt}&endAt=${endAt}&type=url&limit=10`;

      const [stats, metricsResult] = await Promise.all([
        umamiGet<UmamiStats>(statsPath, umamiToken),
        umamiGet<UmamiMetric[]>(metricsPath, umamiToken).catch(() => [] as UmamiMetric[]),
      ]);

      const totalViews = metricsResult.reduce((sum, m) => sum + m.y, 0);
      const topPages = metricsResult.map((m) => ({
        path: m.x,
        views: m.y,
        pct: totalViews > 0 ? Math.round((m.y / totalViews) * 100) : 0,
      }));

      const avgSessionSeconds =
        stats.totaltime.value > 0 && stats.visitors.value > 0
          ? Math.round(stats.totaltime.value / stats.visitors.value)
          : null;

      const bounceRate =
        stats.visitors.value > 0
          ? Number(((stats.bounces.value / stats.visitors.value) * 100).toFixed(2))
          : null;

      const { error: upsertError } = await supabase.from('analytics_snapshots').upsert(
        {
          project_id: project.id,
          period_start: periodStart,
          period_end: periodEnd,
          visitors: stats.visitors.value,
          pageviews: stats.pageviews.value,
          avg_session_seconds: avgSessionSeconds,
          bounce_rate: bounceRate,
          top_pages: topPages,
          performance: null,
          source,
        },
        { onConflict: 'project_id,period_start' },
      );

      if (upsertError) throw new Error(upsertError.message);
      results.push({ projectId: project.id, ok: true });
    } catch (err) {
      results.push({ projectId: project.id, ok: false, error: String(err) });
    }
  }

  return NextResponse.json({ results, count: results.length });
}
