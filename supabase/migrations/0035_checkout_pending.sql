-- Track when a Stripe Checkout session was initiated for a subscription.
-- This lets the dashboard show the pending UI even when the user refreshes
-- (losing ?subscribed=true from the URL) while the webhook hasn't fired yet.
-- Cleared to NULL by the webhook on checkout.session.completed.
alter table projects
  add column if not exists checkout_pending_at timestamptz;
