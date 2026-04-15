-- supabase/migrations/0022_request_comments.sql

CREATE TABLE public.request_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  change_request_id UUID NOT NULL REFERENCES public.change_requests(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.request_comments ENABLE ROW LEVEL SECURITY;

-- Clients can read comments on their own requests
CREATE POLICY "Clients can view comments on their requests"
  ON public.request_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.change_requests cr
      WHERE cr.id = change_request_id AND cr.client_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Clients and admins can post comments (must be own author_id)
CREATE POLICY "Users can insert comments on accessible requests"
  ON public.request_comments FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND (
      EXISTS (
        SELECT 1 FROM public.change_requests cr
        WHERE cr.id = change_request_id AND cr.client_id = auth.uid()
      )
      OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );
