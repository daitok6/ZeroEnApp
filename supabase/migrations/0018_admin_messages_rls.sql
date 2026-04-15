-- Allow admins to read all messages and send messages to any project thread
create policy "Admins can view all messages"
  on public.messages for select
  using (public.is_admin());

create policy "Admins can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id and public.is_admin());
