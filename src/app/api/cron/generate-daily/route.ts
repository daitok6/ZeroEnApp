import { NextRequest, NextResponse } from 'next/server';
import { generateForDate } from '@/lib/tasks/generator';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await generateForDate(new Date());
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[cron] generate-daily error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
