import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { generateForDate, maybeBackfill } from '@/lib/tasks/generator';
import { getTasksDueOn } from '@/lib/tasks/queries';
import { sendEmail } from '@/lib/email/send';
import { morningDigestEmail } from '@/lib/email/templates';
import { DIGEST_TO, DIGEST_FROM } from '@/lib/tasks/config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zeroen.dev';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];
  const startMs = Date.now();
  console.log(`[morning-digest] start date=${today}`);

  try {
    // Backfill on first run (no-op after that)
    await maybeBackfill();

    // Generate today's cadence tasks
    await generateForDate(new Date());

    // Fetch today's open tasks
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const tasks = await getTasksDueOn(supabase, today);
    console.log(`[morning-digest] ${tasks.length} open tasks fetched`);

    if (tasks.length === 0) {
      console.log(`[morning-digest] no tasks — skipping email`);
      return NextResponse.json({ ok: true, sent: false, reason: 'no tasks due today' });
    }

    const criticalCount = tasks.filter((t) => t.urgency === 'critical').length;
    const highCount = tasks.filter((t) => t.urgency === 'high').length;
    console.log(`[morning-digest] urgency: critical=${criticalCount} high=${highCount}`);

    const { subject, html } = morningDigestEmail({
      tasks,
      date: today,
      dashboardUrl: `${SITE_URL}/en/admin/tasks`,
    });

    await sendEmail({ to: DIGEST_TO, from: DIGEST_FROM, subject, html });

    const durationMs = Date.now() - startMs;
    console.log(`[morning-digest] done sent=true tasks=${tasks.length} duration=${durationMs}ms`);

    return NextResponse.json({ ok: true, sent: true, taskCount: tasks.length, criticalCount, highCount, durationMs });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[morning-digest] fatal error: ${message}`, err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
