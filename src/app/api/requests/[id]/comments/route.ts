import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { notifyRequestEvent } from '@/lib/email/request-notifications';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: comments, error } = await supabase
    .from('request_comments')
    .select('id, content, created_at, author_id, author:profiles!request_comments_author_id_fkey(full_name, role)')
    .eq('change_request_id', id)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }

  return NextResponse.json(comments ?? []);
}

const postSchema = z.object({
  content: z.string().min(1).max(2000),
});

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: z.infer<typeof postSchema>;
  try {
    body = postSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { data: comment, error } = await supabase
    .from('request_comments')
    .insert({
      change_request_id: id,
      author_id: user.id,
      content: body.content,
    })
    .select('id, content, created_at, author_id')
    .single();

  if (error) {
    console.error('comment insert error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }

  void notifyRequestEvent({
    event: 'comment',
    requestId: id,
    actorId: user.id,
    payload: { commentExcerpt: body.content },
  });

  return NextResponse.json(comment);
}
