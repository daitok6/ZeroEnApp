export type TaskKind = 'manual' | 'cadence' | 'state_change';
export type TaskUrgency = 'low' | 'normal' | 'high' | 'critical';
export type TaskCategory = 'client_ops' | 'billing' | 'marketing' | 'content' | 'admin' | 'personal';
export type TaskStatus = 'open' | 'done' | 'dismissed';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  kind: TaskKind;
  rule_key: string | null;
  client_id: string | null;
  related_table: string | null;
  related_id: string | null;
  due_date: string; // YYYY-MM-DD
  due_time: string | null;
  urgency: TaskUrgency;
  category: TaskCategory;
  status: TaskStatus;
  completed_at: string | null;
  dedupe_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskWithMeta extends Task {
  looks_done: boolean;
  client_name: string | null;
  client_email: string | null;
}

export interface NewTask {
  title: string;
  description?: string | null;
  kind: TaskKind;
  rule_key?: string | null;
  client_id?: string | null;
  related_table?: string | null;
  related_id?: string | null;
  due_date: string;
  due_time?: string | null;
  urgency?: TaskUrgency;
  category?: TaskCategory;
  dedupe_key?: string | null;
}

// Color maps for UI
export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  client_ops: '#3B82F6',
  billing:    '#F59E0B',
  marketing:  '#8B5CF6',
  content:    '#06B6D4',
  admin:      '#6B7280',
  personal:   '#EC4899',
};

export const URGENCY_COLORS: Record<TaskUrgency, string> = {
  low:      '#374151',
  normal:   '#6B7280',
  high:     '#F59E0B',
  critical: '#EF4444',
};

export const URGENCY_LABELS: Record<TaskUrgency, string> = {
  low:      'Low',
  normal:   'Normal',
  high:     'High',
  critical: 'Critical',
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  client_ops: 'Client Ops',
  billing:    'Billing',
  marketing:  'Marketing',
  content:    'Content',
  admin:      'Admin',
  personal:   'Personal',
};
