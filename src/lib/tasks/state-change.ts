import { createAdminClient } from '@/lib/supabase/admin';
import type { NewTask } from './types';

// Emit a state-change task. Idempotent via dedupe_key.
export async function emitStateTask(task: NewTask): Promise<void> {
  if (!task.dedupe_key) {
    console.warn('[tasks] emitStateTask called without dedupe_key — skipping:', task.title);
    return;
  }

  try {
    const db = createAdminClient();
    const { error } = await db
      .from('tasks')
      .upsert([task], { onConflict: 'dedupe_key', ignoreDuplicates: true });

    if (error) {
      console.error('[tasks] emitStateTask error:', error.message);
    }
  } catch (err) {
    // Non-fatal — task emission should never break the calling operation
    console.error('[tasks] emitStateTask unexpected error:', err);
  }
}

// ── Helpers to build well-typed tasks for each rule ──────────────────────────

export function applicationScoreTask(applicationId: string, clientId?: string): NewTask {
  return {
    title: 'Score and respond to new application',
    kind: 'state_change',
    rule_key: 'application_score',
    client_id: clientId ?? null,
    related_table: 'applications',
    related_id: applicationId,
    due_date: todayStr(),
    urgency: 'high',
    category: 'client_ops',
    dedupe_key: `state:application_score:${applicationId}`,
  };
}

export function draftScopeTask(projectId: string, clientId: string, projectName: string): NewTask {
  return {
    title: `Draft scope doc — ${projectName}`,
    kind: 'state_change',
    rule_key: 'draft_scope',
    client_id: clientId,
    related_table: 'projects',
    related_id: projectId,
    due_date: addDaysStr(new Date(), 3),
    urgency: 'high',
    category: 'client_ops',
    dedupe_key: `state:draft_scope:${projectId}`,
  };
}

export function scheduleFirstReportTask(projectId: string, clientId: string, projectName: string): NewTask {
  return {
    title: `Schedule first monthly report — ${projectName}`,
    kind: 'state_change',
    rule_key: 'schedule_first_report',
    client_id: clientId,
    related_table: 'projects',
    related_id: projectId,
    due_date: addDaysStr(new Date(), 7),
    urgency: 'normal',
    category: 'client_ops',
    dedupe_key: `state:schedule_first_report:${projectId}`,
  };
}

export function invoiceVerifyTask(invoiceId: string, clientId: string, dueDate: string | null, description: string): NewTask {
  return {
    title: `Verify payment — ${description}`,
    kind: 'state_change',
    rule_key: 'invoice_verify',
    client_id: clientId,
    related_table: 'invoices',
    related_id: invoiceId,
    due_date: dueDate ?? addDaysStr(new Date(), 7),
    urgency: 'normal',
    category: 'billing',
    dedupe_key: `state:invoice_verify:${invoiceId}`,
  };
}

export function invoiceReminderTask(invoiceId: string, clientId: string, description: string): NewTask {
  return {
    title: `Send payment reminder — ${description}`,
    kind: 'state_change',
    rule_key: 'invoice_reminder',
    client_id: clientId,
    related_table: 'invoices',
    related_id: invoiceId,
    due_date: todayStr(),
    urgency: 'high',
    category: 'billing',
    dedupe_key: `state:invoice_reminder:${invoiceId}`,
  };
}

export function invoicePauseTask(projectId: string, clientId: string, projectName: string): NewTask {
  return {
    title: `Pause site — overdue invoice — ${projectName}`,
    kind: 'state_change',
    rule_key: 'invoice_pause',
    client_id: clientId,
    related_table: 'projects',
    related_id: projectId,
    due_date: todayStr(),
    urgency: 'critical',
    category: 'billing',
    dedupe_key: `state:invoice_pause:${projectId}`,
  };
}

export function changeRequestReviewTask(requestId: string, clientId: string, requestTitle: string): NewTask {
  return {
    title: `Review change request — ${requestTitle}`,
    kind: 'state_change',
    rule_key: 'change_request_review',
    client_id: clientId,
    related_table: 'change_requests',
    related_id: requestId,
    due_date: addDaysStr(new Date(), 2),
    urgency: 'normal',
    category: 'client_ops',
    dedupe_key: `state:change_request_review:${requestId}`,
  };
}

export function replyClientMessageTask(projectId: string, clientId: string, projectName: string): NewTask {
  return {
    title: `Reply to client message — ${projectName}`,
    kind: 'state_change',
    rule_key: 'reply_client_message',
    client_id: clientId,
    related_table: 'projects',
    related_id: projectId,
    due_date: todayStr(),
    urgency: 'normal',
    category: 'client_ops',
    // Not using dedupe_key here — messages can be ongoing; task reappears for each conversation turn
    // Use a time-bucketed dedupe key (one per day per project)
    dedupe_key: `state:reply_client_message:${projectId}:${todayStr()}`,
  };
}

export function quarterlyAuditTask(projectId: string, clientId: string, projectName: string): NewTask {
  return {
    title: `Run quarterly security + SEO audit — ${projectName}`,
    kind: 'state_change',
    rule_key: 'quarterly_audit',
    client_id: clientId,
    related_table: 'projects',
    related_id: projectId,
    due_date: addDaysStr(new Date(), 14),
    urgency: 'normal',
    category: 'client_ops',
    dedupe_key: `state:quarterly_audit:${projectId}:${quarterKey()}`,
  };
}

export function renewalCheckTask(projectId: string, clientId: string, projectName: string): NewTask {
  return {
    title: `Check renewal intent — commitment ending soon — ${projectName}`,
    kind: 'state_change',
    rule_key: 'renewal_check',
    client_id: clientId,
    related_table: 'projects',
    related_id: projectId,
    due_date: todayStr(),
    urgency: 'high',
    category: 'client_ops',
    dedupe_key: `state:renewal_check:${projectId}`,
  };
}

// ── Date utils ────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function addDaysStr(date: Date, n: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function quarterKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-Q${Math.ceil((now.getMonth() + 1) / 3)}`;
}
