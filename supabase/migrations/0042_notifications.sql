-- Notifications table: persistent per-user notification feed.
-- Emitted by DB triggers when messages, request comments, invoices, or
-- change request statuses change.

create table notifications (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  type           text        not null check (type in ('message', 'request_comment', 'invoice_update', 'request_status')),
  entity_id      uuid        not null,   -- project_id or change_request_id
  entity_kind    text        not null check (entity_kind in ('project', 'change_request')),
  title          text        not null,
  body           text,
  link           text        not null,   -- e.g. /dashboard/messages or /dashboard/requests
  created_at     timestamptz not null default now(),
  read_at        timestamptz,
  dismissed_at   timestamptz
);

create index notifications_user_created
  on notifications (user_id, created_at desc)
  where dismissed_at is null;

create index notifications_user_unread
  on notifications (user_id, read_at)
  where read_at is null and dismissed_at is null;

-- RLS: each user can only see and update their own notifications
alter table notifications enable row level security;

create policy "Users can read own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

-- Service role (triggers) can insert
create policy "Service role can insert notifications"
  on notifications for insert
  with check (true);

-- ─────────────────────────────────────────────────────────────
-- Helper: insert a notification for a target user
-- ─────────────────────────────────────────────────────────────
create or replace function create_notification(
  p_user_id    uuid,
  p_type       text,
  p_entity_id  uuid,
  p_entity_kind text,
  p_title      text,
  p_body       text,
  p_link       text
) returns void language plpgsql security definer as $$
begin
  insert into notifications (user_id, type, entity_id, entity_kind, title, body, link)
  values (p_user_id, p_type, p_entity_id, p_entity_kind, p_title, p_body, p_link);
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Trigger: new message → notify the OTHER party
-- The other party is determined by role:
--   sender role = 'admin'  → notify the client (project.client_id)
--   sender role = 'client' → notify admins
-- ─────────────────────────────────────────────────────────────
create or replace function notify_on_new_message()
returns trigger language plpgsql security definer as $$
declare
  v_sender_role text;
  v_client_id   uuid;
begin
  -- Sender role
  select role into v_sender_role from profiles where id = NEW.sender_id;

  -- Client who owns this project
  select client_id into v_client_id from projects where id = NEW.project_id;

  if v_sender_role = 'admin' then
    -- Notify the client
    if v_client_id is not null and v_client_id <> NEW.sender_id then
      perform create_notification(
        v_client_id,
        'message',
        NEW.project_id,
        'project',
        'New message from ZeroEn',
        left(NEW.content, 120),
        '/dashboard/messages'
      );
    end if;
  else
    -- Notify all admins
    perform create_notification(
      p.id,
      'message',
      NEW.project_id,
      'project',
      'New message from client',
      left(NEW.content, 120),
      '/admin/messages/' || NEW.project_id::text
    )
    from profiles p where p.role = 'admin';
  end if;

  return NEW;
end;
$$;

create trigger trg_notify_new_message
  after insert on messages
  for each row execute function notify_on_new_message();

-- ─────────────────────────────────────────────────────────────
-- Trigger: new request comment → notify the OTHER party
-- ─────────────────────────────────────────────────────────────
create or replace function notify_on_request_comment()
returns trigger language plpgsql security definer as $$
declare
  v_author_role  text;
  v_client_id    uuid;
  v_req_title    text;
begin
  select role into v_author_role from profiles where id = NEW.author_id;
  select client_id, title into v_client_id, v_req_title
    from change_requests where id = NEW.change_request_id;

  if v_author_role = 'admin' then
    -- Notify the client
    if v_client_id is not null and v_client_id <> NEW.author_id then
      perform create_notification(
        v_client_id,
        'request_comment',
        NEW.change_request_id,
        'change_request',
        'New comment on "' || coalesce(v_req_title, 'your request') || '"',
        left(NEW.body, 120),
        '/dashboard/requests'
      );
    end if;
  else
    -- Notify all admins
    perform create_notification(
      p.id,
      'request_comment',
      NEW.change_request_id,
      'change_request',
      'Client comment on "' || coalesce(v_req_title, 'a request') || '"',
      left(NEW.body, 120),
      '/admin/requests/' || NEW.change_request_id::text
    )
    from profiles p where p.role = 'admin';
  end if;

  return NEW;
end;
$$;

create trigger trg_notify_request_comment
  after insert on request_comments
  for each row execute function notify_on_request_comment();

-- ─────────────────────────────────────────────────────────────
-- Trigger: invoice update → notify the client
-- ─────────────────────────────────────────────────────────────
create or replace function notify_on_invoice_update()
returns trigger language plpgsql security definer as $$
declare
  v_client_id uuid;
  v_req_title text;
begin
  if NEW.change_request_id is null then return NEW; end if;
  -- Only fire when status actually changes
  if OLD.status = NEW.status then return NEW; end if;

  select client_id, title into v_client_id, v_req_title
    from change_requests where id = NEW.change_request_id;

  if v_client_id is not null then
    perform create_notification(
      v_client_id,
      'invoice_update',
      NEW.change_request_id,
      'change_request',
      'Invoice updated for "' || coalesce(v_req_title, 'your request') || '"',
      'Status: ' || NEW.status,
      '/dashboard/requests'
    );
  end if;

  return NEW;
end;
$$;

create trigger trg_notify_invoice_update
  after update on invoices
  for each row execute function notify_on_invoice_update();

-- ─────────────────────────────────────────────────────────────
-- Trigger: change_request status update → notify the client
-- ─────────────────────────────────────────────────────────────
create or replace function notify_on_request_status()
returns trigger language plpgsql security definer as $$
begin
  -- Only fire when status actually changes
  if OLD.status = NEW.status then return NEW; end if;

  -- Notify the client
  if NEW.client_id is not null then
    perform create_notification(
      NEW.client_id,
      'request_status',
      NEW.id,
      'change_request',
      'Request "' || coalesce(NEW.title, 'your request') || '" updated',
      'New status: ' || NEW.status,
      '/dashboard/requests'
    );
  end if;

  return NEW;
end;
$$;

create trigger trg_notify_request_status
  after update on change_requests
  for each row execute function notify_on_request_status();
