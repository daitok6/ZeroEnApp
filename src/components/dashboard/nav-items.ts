import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, MessageSquare, FileText, Receipt, PlusCircle, Users, ClipboardList, Send, Rocket, Inbox } from 'lucide-react';

export const navItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/dashboard' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/dashboard/messages' },
  { key: 'documents', icon: FileText, labelEn: 'Documents', labelJa: '書類', path: '/dashboard/documents' },
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
  { key: 'requests', icon: Inbox, labelEn: 'Requests', labelJa: 'リクエスト', path: '/admin/requests' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/admin/messages' },
  { key: 'documents', icon: FileText, labelEn: 'Documents', labelJa: '書類', path: '/admin/documents' },
] as const;
