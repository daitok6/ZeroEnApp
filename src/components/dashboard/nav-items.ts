import { LayoutDashboard, MessageSquare, FileText, Receipt, PlusCircle } from 'lucide-react';

export const navItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/dashboard' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/dashboard/messages' },
  { key: 'files', icon: FileText, labelEn: 'Files', labelJa: 'ファイル', path: '/dashboard/files' },
  { key: 'invoices', icon: Receipt, labelEn: 'Invoices', labelJa: '請求書', path: '/dashboard/invoices' },
  { key: 'requests', icon: PlusCircle, labelEn: 'Requests', labelJa: 'リクエスト', path: '/dashboard/requests' },
] as const;
