import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, MessageSquare, FileText, Receipt, PlusCircle, Users, ClipboardList, Send, Rocket, Inbox, CreditCard, Settings, UserPlus, BarChart3, ShieldCheck } from 'lucide-react';

export const navItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/dashboard' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/dashboard/messages' },
  { key: 'documents', icon: FileText, labelEn: 'Documents', labelJa: '書類', path: '/dashboard/documents' },
  { key: 'invoices', icon: Receipt, labelEn: 'Invoices', labelJa: '請求書', path: '/dashboard/invoices' },
  { key: 'billing', icon: CreditCard, labelEn: 'Billing', labelJa: 'お支払い', path: '/dashboard/billing' },
  { key: 'requests', icon: PlusCircle, labelEn: 'Requests', labelJa: 'リクエスト', path: '/dashboard/requests' },
  { key: 'analytics', icon: BarChart3, labelEn: 'Analytics', labelJa: 'アナリティクス', path: '/dashboard/analytics' },
  { key: 'audits', icon: ShieldCheck, labelEn: 'Audits', labelJa: '監査', path: '/dashboard/audits' },
  { key: 'settings', icon: Settings, labelEn: 'Settings', labelJa: '設定', path: '/dashboard/settings' },
] as const;

export type NavItem = {
  readonly key: string;
  readonly icon: LucideIcon;
  readonly labelEn: string;
  readonly labelJa: string;
  readonly path: string;
};

/** Keys that are locked until the project is visible AND a plan is chosen. */
export const PROJECT_LOCKED_KEYS = new Set(['documents', 'invoices', 'billing', 'requests', 'analytics', 'audits']);

/** Compute which nav keys should be locked for a given project state. */
export function getLockedKeys(project: { client_visible: boolean; plan_tier: string | null } | null): Set<string> {
  if (!project || !project.client_visible || !project.plan_tier) {
    return PROJECT_LOCKED_KEYS;
  }
  return new Set<string>();
}

export const pendingNavItems = [
  { key: 'apply', icon: Send, labelEn: 'Apply', labelJa: '応募', path: '/dashboard/apply' },
  { key: 'applicationStatus', icon: ClipboardList, labelEn: 'Application Status', labelJa: '応募状況', path: '/dashboard/application-status' },
] as const;

export const onboardingNavItems = [
  { key: 'onboarding', icon: Rocket, labelEn: 'Get Started', labelJa: 'はじめましょう', path: '/dashboard/onboarding' },
] as const;

export const adminNavItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/admin' },
  { key: 'clients', icon: Users, labelEn: 'Clients', labelJa: 'クライアント', path: '/admin/clients' },
  { key: 'managedClients', icon: UserPlus, labelEn: 'Add Client', labelJa: 'クライアント追加', path: '/admin/managed-clients' },
  { key: 'applications', icon: ClipboardList, labelEn: 'Applications', labelJa: '応募', path: '/admin/applications' },
  { key: 'requests', icon: Inbox, labelEn: 'Requests', labelJa: 'リクエスト', path: '/admin/requests' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/admin/messages' },
  { key: 'documents', icon: FileText, labelEn: 'Documents', labelJa: '書類', path: '/admin/documents' },
  { key: 'audits', icon: ShieldCheck, labelEn: 'Audits', labelJa: '監査', path: '/admin/audits' },
] as const;
