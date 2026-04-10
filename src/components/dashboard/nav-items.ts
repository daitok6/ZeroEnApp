import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, MessageSquare, FileText, Receipt, PlusCircle, Users, ClipboardList, Send, Rocket } from 'lucide-react';

export const navItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/dashboard' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/dashboard/messages' },
  { key: 'files', icon: FileText, labelEn: 'Files', labelJa: 'ファイル', path: '/dashboard/files' },
  { key: 'invoices', icon: Receipt, labelEn: 'Invoices', labelJa: '請求書', path: '/dashboard/invoices' },
  { key: 'requests', icon: PlusCircle, labelEn: 'Requests', labelJa: 'リクエスト', path: '/dashboard/requests' },
] as const;

export type NavItem = {
  readonly key: string;
  readonly icon: LucideIcon;
  readonly labelEn: string;
  readonly labelJa: string;
  readonly path: string;
};

// Nav for users who haven't been approved yet — apply + check status only
export const pendingNavItems = [
  { key: 'apply', icon: Send, labelEn: 'Apply', labelJa: '応募', path: '/dashboard/apply' },
  { key: 'application-status', icon: ClipboardList, labelEn: 'Application Status', labelJa: '応募状況', path: '/dashboard/application-status' },
] as const;

export const onboardingNavItems = [
  { key: 'onboarding', icon: Rocket, labelEn: 'Get Started', labelJa: 'はじめましょう', path: '/dashboard/onboarding' },
] as const;

export const adminNavItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/admin' },
  { key: 'clients', icon: Users, labelEn: 'Clients', labelJa: 'クライアント', path: '/admin/clients' },
  { key: 'applications', icon: ClipboardList, labelEn: 'Applications', labelJa: '応募', path: '/admin/applications' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/admin/messages' },
] as const;
