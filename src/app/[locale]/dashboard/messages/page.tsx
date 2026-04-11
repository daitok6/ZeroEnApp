import { requireApproved } from '@/lib/auth/require-approved';
import { MessageThread } from '@/components/dashboard/message-thread';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function MessagesPage({ params }: Props) {
  const { locale } = await params;
  const { user, supabase } = await requireApproved(locale);

  // Get user's project
  let { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('client_id', user.id)
    .maybeSingle();

  // Auto-create a project row so messaging is always available
  if (!project) {
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: newProject } = await adminSupabase
      .from('projects')
      .insert({ client_id: user.id, name: 'Your Project', status: 'onboarding' })
      .select('id, name')
      .single();
    project = newProject;
  }

  // Get initial messages
  const messages = project
    ? (await supabase
        .from('messages')
        .select('*, sender:profiles(full_name, avatar_url, role)')
        .eq('project_id', project.id)
        .order('created_at', { ascending: true })
        .limit(50)).data ?? []
    : [];

  // Get admin's last_read_at for this project (for Seen indicator)
  let adminLastReadAt: string | null = null;
  if (project) {
    // Find the admin user ID
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .single();

    if (adminProfile) {
      const { data: readStatus } = await supabase
        .from('message_read_status')
        .select('last_read_at')
        .eq('user_id', adminProfile.id)
        .eq('project_id', project.id)
        .single();

      adminLastReadAt = readStatus?.last_read_at ?? null;
    }
  }

  return (
    <div className="flex flex-col h-full max-w-3xl">
      <div className="mb-4 shrink-0">
        <h1 className="text-xl font-bold font-heading text-[#F4F4F2]">
          {locale === 'ja' ? 'メッセージ' : 'Messages'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {project?.name ?? (locale === 'ja' ? 'チームとチャット' : 'Chat with the team')}
        </p>
      </div>

      {project && (
        <MessageThread
          initialMessages={messages as Message[]}
          projectId={project.id}
          userId={user.id}
          locale={locale}
          adminLastReadAt={adminLastReadAt}
        />
      )}
    </div>
  );
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender?: { full_name: string | null; avatar_url: string | null; role: string };
}
