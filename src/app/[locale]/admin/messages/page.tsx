import { createClient } from '@/lib/supabase/server';
import { getProjectsWithLatestMessage } from '@/lib/admin/queries';
import { AdminMessagesClient } from '@/components/admin/admin-messages-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages — ZeroEn Admin',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender?: { full_name: string | null; avatar_url: string | null; role: string };
}

export default async function AdminMessagesPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const projects = await getProjectsWithLatestMessage(supabase);

  // Load initial messages for the first project
  const firstProject = projects[0] ?? null;
  const initialMessages: Message[] = firstProject
    ? ((await supabase
        .from('messages')
        .select('*, sender:profiles(full_name, avatar_url, role)')
        .eq('project_id', firstProject.id)
        .order('created_at', { ascending: true })
        .limit(50)).data ?? []) as Message[]
    : [];

  return (
    <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 4rem)' }}>
      <div className="mb-4 shrink-0">
        <h1 className="text-xl font-bold font-heading text-[#F4F4F2]">
          {locale === 'ja' ? 'メッセージ' : 'Messages'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {locale === 'ja' ? '全クライアントの会話' : 'All client conversations'}
        </p>
      </div>

      <AdminMessagesClient
        projects={projects}
        initialMessages={initialMessages}
        initialProjectId={firstProject?.id ?? null}
        userId={user?.id ?? ''}
        locale={locale}
      />
    </div>
  );
}
