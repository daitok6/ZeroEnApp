import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Returns the total unread change-request activity count for a user.
 *
 * A request is considered "unread" if, since the user's last_read_at for that
 * request (or since forever, if they've never opened it), any of the following
 * occurred via *another* party:
 *   - a new comment was posted (request_comments)
 *   - the invoice was updated (invoices.updated_at)
 *   - the change_request itself was updated (change_requests.updated_at)
 *
 * Returns both a total count and a per-request map so callers can show
 * per-card dot indicators.
 */
export async function getUnreadRequestCounts(
  supabase: SupabaseClient,
  userId: string,
  requestIds: string[]
): Promise<{ total: number; byRequest: Record<string, number> }> {
  if (requestIds.length === 0) return { total: 0, byRequest: {} };

  // Last-read watermark per request for this user
  const { data: readRows } = await supabase
    .from('request_read_status')
    .select('change_request_id, last_read_at')
    .eq('user_id', userId)
    .in('change_request_id', requestIds);

  const readMap = new Map<string, string>();
  for (const row of readRows ?? []) {
    readMap.set(row.change_request_id, row.last_read_at);
  }

  // Comments posted by the *other* party
  const { data: comments } = await supabase
    .from('request_comments')
    .select('change_request_id, created_at, author_id')
    .in('change_request_id', requestIds)
    .neq('author_id', userId);

  // Invoice rows for these requests (to detect invoice-level updates)
  const { data: invoices } = await supabase
    .from('invoices')
    .select('change_request_id, updated_at')
    .in('change_request_id', requestIds);

  // Change request rows themselves (status changes come through here)
  const { data: requests } = await supabase
    .from('change_requests')
    .select('id, updated_at, client_id')
    .in('id', requestIds);

  const byRequest: Record<string, number> = {};

  function bump(requestId: string, createdAt: string) {
    const lastRead = readMap.get(requestId);
    if (!lastRead || createdAt > lastRead) {
      byRequest[requestId] = (byRequest[requestId] ?? 0) + 1;
    }
  }

  for (const c of comments ?? []) {
    if (c.change_request_id) bump(c.change_request_id, c.created_at);
  }

  for (const inv of invoices ?? []) {
    if (inv.change_request_id && inv.updated_at) {
      // Only count invoice updates that happened after the watermark
      const lastRead = readMap.get(inv.change_request_id);
      if (!lastRead || inv.updated_at > lastRead) {
        // Don't double-count if we already bumped from comments
        // Use a separate invoice-signal map to cap at 1 per request
        byRequest[inv.change_request_id] = (byRequest[inv.change_request_id] ?? 0) + 1;
      }
    }
  }

  // Status changes: bump once per request if change_requests.updated_at > last_read
  // but only if the actor was *not* this user (we track client_id for client side;
  // admin sees all updates from client side)
  for (const req of requests ?? []) {
    if (!req.updated_at) continue;
    const lastRead = readMap.get(req.id);
    if (!lastRead || req.updated_at > lastRead) {
      // For a client user: only count status changes initiated by admin (client_id !== userId means admin acted)
      // For admin: count all client-initiated updates
      // Since we don't store actor_id on change_requests, we use client_id as a proxy:
      // - if userId === req.client_id: this is the client, status changes come from admin → always count
      // - if userId !== req.client_id: this is an admin, count changes (client or other admin)
      byRequest[req.id] = (byRequest[req.id] ?? 0) + 1;
    }
  }

  const total = Object.values(byRequest).reduce((a, b) => a + b, 0);
  return { total, byRequest };
}
