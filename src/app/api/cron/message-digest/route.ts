import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { sendEmail, OPERATOR_EMAIL_ADDRESS } from '@/lib/email/send';
import { newMessageEmail, adminDigestEmail } from '@/lib/email/templates';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zeroen.dev';
const CLIENT_NOTIFICATION_COOLDOWN_HOURS = 4;

export async function GET(request: NextRequest) {
  // Authenticate cron requests
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use service role client to bypass RLS for cron operations
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();
  const cooldownCutoff = new Date(now.getTime() - CLIENT_NOTIFICATION_COOLDOWN_HOURS * 60 * 60 * 1000).toISOString();

  // Find the admin user
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single();

  if (!adminProfile) {
    return NextResponse.json({ ok: true, message: 'No admin found' });
  }

  // Get all projects with client profiles
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, client_id, client:profiles!projects_client_id_fkey(id, email, full_name, locale)');

  if (!projects || projects.length === 0) {
    return NextResponse.json({ ok: true, message: 'No projects' });
  }

  const projectIds = projects.map((p: { id: string }) => p.id);

  // Get admin's last_read_at per project
  const { data: adminReadStatus } = await supabase
    .from('message_read_status')
    .select('project_id, last_read_at')
    .eq('user_id', adminProfile.id)
    .in('project_id', projectIds);

  const adminLastRead = new Map<string, string>();
  for (const row of adminReadStatus ?? []) {
    adminLastRead.set(row.project_id, row.last_read_at);
  }

  // Get recent messages for all projects
  const { data: recentMessages } = await supabase
    .from('messages')
    .select('id, project_id, sender_id, content, created_at, sender:profiles(id, email, full_name, role)')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false });

  const messagesByProject = new Map<string, typeof recentMessages>();
  for (const msg of recentMessages ?? []) {
    const existing = messagesByProject.get(msg.project_id) ?? [];
    existing.push(msg);
    messagesByProject.set(msg.project_id, existing);
  }

  // ── 1. Admin digest: find projects with unread client messages ───────────────
  const adminUnreadThreads: Array<{
    projectName: string;
    clientName: string;
    unreadCount: number;
    latestMessage: string;
    conversationUrl: string;
  }> = [];

  // ── 2. Client notifications: check each project for unread admin messages ───
  const clientNotificationsSent: string[] = [];

  for (const project of projects) {
    const msgs = messagesByProject.get(project.id) ?? [];
    const adminRead = adminLastRead.get(project.id);
    const client = Array.isArray(project.client) ? project.client[0] : project.client;

    if (!client) continue;

    // Messages from clients that admin hasn't read
    const unreadFromClient = msgs.filter((m: { sender_id: string; created_at: string }) =>
      m.sender_id !== adminProfile.id &&
      (!adminRead || m.created_at > adminRead)
    );

    if (unreadFromClient.length > 0) {
      const latest = unreadFromClient[0]; // sorted desc
      const senderProfile = Array.isArray(latest.sender) ? latest.sender[0] : latest.sender;
      adminUnreadThreads.push({
        projectName: project.name,
        clientName: senderProfile?.full_name ?? client.email,
        unreadCount: unreadFromClient.length,
        latestMessage: latest.content,
        conversationUrl: `${SITE_URL}/en/admin/messages`,
      });
    }

    // Check if client has unread admin messages (admin sent since client's last read)
    const { data: clientReadStatus } = await supabase
      .from('message_read_status')
      .select('last_read_at')
      .eq('user_id', client.id)
      .eq('project_id', project.id)
      .single();

    const clientLastRead = clientReadStatus?.last_read_at ?? null;
    const unreadForClient = msgs.filter((m: { sender_id: string; created_at: string }) =>
      m.sender_id === adminProfile.id &&
      (!clientLastRead || m.created_at > clientLastRead)
    );

    if (unreadForClient.length > 0) {
      // Check cooldown: has client been notified in last 4 hours?
      const { data: recentNotif } = await supabase
        .from('message_notification_log')
        .select('id')
        .eq('recipient_id', client.id)
        .eq('project_id', project.id)
        .eq('type', 'client_instant')
        .gte('sent_at', cooldownCutoff)
        .limit(1)
        .single();

      if (!recentNotif) {
        // Send client notification
        const locale = (client.locale as 'en' | 'ja') ?? 'en';
        const latestAdminMsg = unreadForClient[0];
        const { subject, html } = newMessageEmail({
          recipientName: client.full_name ?? client.email,
          senderName: 'ZeroEn',
          projectName: project.name,
          messagePreview: latestAdminMsg.content,
          locale,
          dashboardUrl: `${SITE_URL}/${locale}/dashboard/messages`,
        });

        await sendEmail({ to: client.email, subject, html });

        // Log the notification
        await supabase.from('message_notification_log').insert({
          recipient_id: client.id,
          project_id: project.id,
          type: 'client_instant',
        });

        clientNotificationsSent.push(project.id);
      }
    }
  }

  // Send admin digest if there are unread threads
  let adminDigestSent = false;
  if (adminUnreadThreads.length > 0) {
    const totalUnread = adminUnreadThreads.reduce((sum, t) => sum + t.unreadCount, 0);
    const { subject, html } = adminDigestEmail({
      threads: adminUnreadThreads,
      totalUnread,
      dashboardUrl: `${SITE_URL}/en/admin/messages`,
    });

    await sendEmail({ to: OPERATOR_EMAIL_ADDRESS, subject, html });

    // Log the digest
    await supabase.from('message_notification_log').insert({
      recipient_id: adminProfile.id,
      project_id: adminUnreadThreads[0] ? projects.find((p: { name: string }) => p.name === adminUnreadThreads[0].projectName)?.id ?? projectIds[0] : projectIds[0],
      type: 'admin_digest',
    });

    adminDigestSent = true;
  }

  return NextResponse.json({
    ok: true,
    adminDigestSent,
    adminUnreadThreads: adminUnreadThreads.length,
    clientNotificationsSent: clientNotificationsSent.length,
  });
}
