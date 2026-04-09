import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { MessageThread } from '@/components/dashboard/message-thread';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function MessagesPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // Get user's project
  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('client_id', user.id)
    .single();

  // Get initial messages
  const messages = project
    ? (await supabase
        .from('messages')
        .select('*, sender:profiles(full_name, avatar_url, role)')
        .eq('project_id', project.id)
        .order('created_at', { ascending: true })
        .limit(50)).data ?? []
    : [];

  return (
    <div className="flex flex-col h-full max-w-3xl" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="mb-4 shrink-0">
        <h1 className="text-xl font-bold font-mono text-[#F4F4F2]">
          {locale === 'ja' ? 'メッセージ' : 'Messages'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {project
            ? project.name
            : locale === 'ja'
            ? 'プロジェクト開始後に利用可能'
            : 'Available once your project starts'}
        </p>
      </div>

      {project ? (
        <MessageThread
          initialMessages={messages as Message[]}
          projectId={project.id}
          userId={user.id}
          locale={locale}
        />
      ) : (
        <div className="flex-1 border border-[#374151] rounded-lg bg-[#111827] flex items-center justify-center">
          <p className="text-[#6B7280] font-mono text-sm text-center px-4">
            {locale === 'ja'
              ? 'プロジェクトが開始されると、チームとメッセージのやり取りができます。'
              : 'Messages will appear here once your project starts.'}
          </p>
        </div>
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
