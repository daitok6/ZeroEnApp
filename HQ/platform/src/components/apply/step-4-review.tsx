'use client';

import type { ApplicationFormData } from '@/lib/validations/application';

interface Step4Props {
  data: ApplicationFormData;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  locale: string;
}

function ReviewSection({
  title,
  fields,
  onEdit,
  editLabel,
}: {
  title: string;
  fields: { label: string; value: string | undefined }[];
  onEdit: () => void;
  editLabel: string;
}) {
  return (
    <div className="border border-[#374151] rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#00E87A] font-mono font-bold text-sm uppercase tracking-widest">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-[#6B7280] hover:text-[#00E87A] text-xs font-mono transition-colors"
        >
          {editLabel}
        </button>
      </div>
      {fields.map((field) => (
        <div key={field.label}>
          <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider mb-1">{field.label}</p>
          <p className="text-[#F4F4F2] text-sm font-mono">{field.value || '—'}</p>
        </div>
      ))}
    </div>
  );
}

export function Step4Review({ data, onSubmit, onBack, isSubmitting, locale }: Step4Props) {
  const isJa = locale === 'ja';

  const commitmentLabels: Record<string, string> = isJa
    ? { 'full-time': 'フルタイム', 'part-time': 'パートタイム', 'side-project': 'サイドプロジェクト' }
    : { 'full-time': 'Full-time', 'part-time': 'Part-time', 'side-project': 'Side project' };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {isJa ? '確認・送信' : 'Review & Submit'}
      </h2>

      <ReviewSection
        title={isJa ? 'アイデア' : 'Idea'}
        editLabel={isJa ? '編集' : 'Edit'}
        onEdit={onBack}
        fields={[
          { label: isJa ? '名前' : 'Name', value: data.idea_name },
          { label: isJa ? '説明' : 'Description', value: data.idea_description },
          { label: isJa ? '解決する問題' : 'Problem solved', value: data.problem_solved },
        ]}
      />

      <ReviewSection
        title={isJa ? '市場' : 'Market'}
        editLabel={isJa ? '編集' : 'Edit'}
        onEdit={onBack}
        fields={[
          { label: isJa ? 'ターゲットユーザー' : 'Target users', value: data.target_users },
          { label: isJa ? '競合他社' : 'Competitors', value: data.competitors || (isJa ? 'なし' : 'None specified') },
          { label: isJa ? '収益化計画' : 'Monetization plan', value: data.monetization_plan },
        ]}
      />

      <ReviewSection
        title={isJa ? 'ファウンダー' : 'Founder'}
        editLabel={isJa ? '編集' : 'Edit'}
        onEdit={onBack}
        fields={[
          { label: isJa ? '名前' : 'Name', value: data.founder_name },
          { label: isJa ? 'メール' : 'Email', value: data.founder_email },
          { label: isJa ? 'バックグラウンド' : 'Background', value: data.founder_background },
          { label: isJa ? 'コミット' : 'Commitment', value: commitmentLabels[data.founder_commitment] },
          { label: 'LinkedIn', value: data.linkedin_url || (isJa ? 'なし' : 'Not provided') },
        ]}
      />

      <div className="pt-2 border-t border-[#374151]">
        <p className="text-[#6B7280] text-xs font-mono mb-6">
          {isJa
            ? '申し込みを送信することで、ZeroEnの利用規約とエクイティ条件に同意します。'
            : 'By submitting, you agree to ZeroEn\'s terms and equity arrangement.'}
        </p>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="border border-[#374151] text-[#9CA3AF] font-mono px-8 py-3 rounded hover:border-[#6B7280] transition-colors"
          >
            {isJa ? '← 戻る' : '← Back'}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? (isJa ? '送信中...' : 'Submitting...')
              : (isJa ? '申し込みを送信' : 'Submit Application')}
          </button>
        </div>
      </div>
    </div>
  );
}
