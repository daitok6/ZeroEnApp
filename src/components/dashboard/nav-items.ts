import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, MessageSquare, FileText, Receipt, PlusCircle, Users, Rocket, Inbox, CreditCard, Settings, BarChart3, ShieldCheck, Bell } from 'lucide-react';

export const navItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/dashboard' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/dashboard/messages' },
  { key: 'documents', icon: FileText, labelEn: 'Documents', labelJa: '書類', path: '/dashboard/documents' },
  { key: 'invoices', icon: Receipt, labelEn: 'Invoices', labelJa: '請求書', path: '/dashboard/invoices' },
  { key: 'billing', icon: CreditCard, labelEn: 'Billing', labelJa: 'お支払い', path: '/dashboard/billing' },
  { key: 'requests', icon: PlusCircle, labelEn: 'Change Requests', labelJa: '変更依頼', path: '/dashboard/requests' },
  { key: 'analytics', icon: BarChart3, labelEn: 'Analytics', labelJa: 'アナリティクス', path: '/dashboard/analytics' },
  { key: 'audits', icon: ShieldCheck, labelEn: 'Audits', labelJa: '監査', path: '/dashboard/audits' },
  { key: 'notifications', icon: Bell, labelEn: 'Notifications', labelJa: '通知', path: '/dashboard/notifications' },
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
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Get Started', labelJa: 'はじめる', path: '/dashboard' },
] as const;

export const onboardingNavItems = [
  { key: 'onboarding', icon: Rocket, labelEn: 'Get Started', labelJa: 'はじめましょう', path: '/dashboard/onboarding' },
] as const;

export const adminNavItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/admin' },
  { key: 'clients', icon: Users, labelEn: 'Clients', labelJa: 'クライアント', path: '/admin/clients' },
  { key: 'requests', icon: Inbox, labelEn: 'Change Requests', labelJa: '変更依頼', path: '/admin/requests' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/admin/messages' },
  { key: 'documents', icon: FileText, labelEn: 'Documents', labelJa: '書類', path: '/admin/documents' },
  { key: 'audits', icon: ShieldCheck, labelEn: 'Audits', labelJa: '監査', path: '/admin/audits' },
] as const;
