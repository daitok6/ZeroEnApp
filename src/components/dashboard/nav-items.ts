import { LayoutDashboard, MessageSquare, FileText, Receipt, PlusCircle, Users, ClipboardList } from 'lucide-react';

export const navItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/dashboard' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/dashboard/messages' },
  { key: 'files', icon: FileText, labelEn: 'Files', labelJa: 'ファイル', path: '/dashboard/files' },
  { key: 'invoices', icon: Receipt, labelEn: 'Invoices', labelJa: '請求書', path: '/dashboard/invoices' },
  { key: 'requests', icon: PlusCircle, labelEn: 'Requests', labelJa: 'リクエスト', path: '/dashboard/requests' },
] as const;

export type NavItem = typeof navItems[number];

export const adminNavItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/admin' },
  { key: 'clients', icon: Users, labelEn: 'Clients', labelJa: 'クライアント', path: '/admin/clients' },
  { key: 'applications', icon: ClipboardList, labelEn: 'Applications', labelJa: '応募', path: '/admin/applications' },
] as const;
