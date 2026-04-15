-- Tracks which users have "read" each change request's activity.
-- Mirrors message_read_status but keyed per change_request rather than per project.
-- "Unread" = any request_comments, invoice updates, or change_request status changes
-- that occurred after last_read_at for that (user, request) pair.

create table request_read_status (
  user_id          uuid        not null references auth.users on delete cascade,
  change_request_id uuid       not null references change_requests on delete cascade,
  last_read_at     timestamptz not null default now(),
  primary key (user_id, change_request_id)
);

alter table request_read_status enable row level security;

create policy "own rows"
  on request_read_status for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admin service role bypasses RLS so it can upsert on behalf of any user if needed.
create index on request_read_status(user_id);
