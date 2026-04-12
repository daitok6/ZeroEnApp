'use client';

import { useActionState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { provisionManagedClient } from '@/lib/admin/provision-managed-client';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type ActionState = { success: boolean; error?: string; email?: string } | null;

const initialState: ActionState = null;

async function formAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get('email') as string;
  try {
    const result = await provisionManagedClient(formData);
    if (result.success) {
      return { success: true, email };
    }
    return { success: false, error: result.error };
  } catch {
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

const FIELD_CLASS =
  'w-full px-3 py-2 rounded-lg bg-[#0D0D0D] border border-[#374151] text-[#F4F4F2] font-mono text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#00E87A] transition-colors';
const LABEL_CLASS = 'block text-xs font-mono font-medium text-[#9CA3AF] mb-1.5 uppercase tracking-wide';

export default function NewManagedClientPage() {
  const { locale } = useParams<{ locale: string }>();
  const [state, formActionBound, isPending] = useActionState(formAction, initialState);

  if (state?.success) {
    return (
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
            New Managed Client
          </h1>
        </div>
        <div className="border border-[#00E87A]/30 rounded-lg bg-[#00E87A]/5 p-6 flex items-start gap-3">
          <CheckCircle className="text-[#00E87A] mt-0.5 shrink-0" size={20} />
          <div>
            <p className="text-[#F4F4F2] font-mono font-bold text-sm">Client provisioned</p>
            <p className="text-[#6B7280] font-mono text-xs mt-1">
              Invite email sent to <span className="text-[#F4F4F2]">{state.email}</span>. They will receive a link to set their password.
            </p>
          </div>
        </div>
        <Link
          href={`/${locale}/admin/managed-clients`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#374151] text-[#9CA3AF] font-mono text-sm hover:border-[#4B5563] hover:text-[#F4F4F2] transition-colors"
        >
          ← Back to managed clients
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          New Managed Client
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          Pre-provision a Coconala or direct client — they&apos;ll receive an invite email.
        </p>
      </div>

      {state?.error && (
        <div className="border border-red-500/30 rounded-lg bg-red-500/5 p-4 flex items-start gap-3">
          <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={16} />
          <p className="text-red-400 font-mono text-sm">{state.error}</p>
        </div>
      )}

      <form action={formActionBound} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className={LABEL_CLASS}>
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="off"
            placeholder="client@example.com"
            className={FIELD_CLASS}
          />
        </div>

        {/* Full name */}
        <div>
          <label htmlFor="fullName" className={LABEL_CLASS}>
            Full name <span className="text-red-400">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="off"
            placeholder="Taro Yamada"
            className={FIELD_CLASS}
          />
        </div>

        {/* Locale */}
        <div>
          <label htmlFor="locale" className={LABEL_CLASS}>
            Locale <span className="text-red-400">*</span>
          </label>
          <select id="locale" name="locale" required className={FIELD_CLASS}>
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        {/* Source */}
        <div>
          <label htmlFor="source" className={LABEL_CLASS}>
            Source <span className="text-red-400">*</span>
          </label>
          <select id="source" name="source" required className={FIELD_CLASS}>
            <option value="coconala">Coconala</option>
            <option value="direct">Direct</option>
          </select>
        </div>

        {/* Plan tier */}
        <div>
          <label htmlFor="planTier" className={LABEL_CLASS}>
            Plan tier <span className="text-red-400">*</span>
          </label>
          <select id="planTier" name="planTier" required className={FIELD_CLASS}>
            <option value="basic">Basic (¥8,000/mo)</option>
            <option value="premium">Premium (¥15,000/mo)</option>
          </select>
        </div>

        {/* Scope */}
        <div>
          <label htmlFor="scopeMd" className={LABEL_CLASS}>
            Scope <span className="text-red-400">*</span>
          </label>
          <p className="text-[#6B7280] font-mono text-xs mb-2">
            Markdown. Shown read-only to the client in the onboarding wizard.
          </p>
          <textarea
            id="scopeMd"
            name="scopeMd"
            required
            rows={6}
            placeholder="Describe what will be built..."
            className={`${FIELD_CLASS} resize-y`}
          />
        </div>

        {/* Coconala order ref (optional) */}
        <div>
          <label htmlFor="orderRef" className={LABEL_CLASS}>
            Coconala order #
          </label>
          <input
            id="orderRef"
            name="orderRef"
            type="text"
            autoComplete="off"
            placeholder="e.g. 123456789"
            className={FIELD_CLASS}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00E87A] text-[#0D0D0D] font-mono font-bold text-sm hover:bg-[#00E87A]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {isPending ? 'Provisioning...' : 'Provision client'}
          </button>
          <Link
            href={`/${locale}/admin/managed-clients`}
            className="px-4 py-2.5 rounded-lg border border-[#374151] text-[#9CA3AF] font-mono text-sm hover:border-[#4B5563] hover:text-[#F4F4F2] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
