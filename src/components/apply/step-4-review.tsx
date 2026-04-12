'use client';

import { useTranslations } from 'next-intl';
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

export function Step4Review({ data, onSubmit, onBack, isSubmitting }: Step4Props) {
  const t = useTranslations('apply');
  const tCommon = useTranslations('common');

  const commitmentLabels: Record<string, string> = {
    'full-time': t('step3.commitmentFullTime'),
    'part-time': t('step3.commitmentPartTime'),
    'side-project': t('step3.commitmentSideProject'),
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {t('step4.title')}
      </h2>

      <ReviewSection
        title={t('step4.sectionIdea')}
        editLabel={t('step4.edit')}
        onEdit={onBack}
        fields={[
          { label: t('step4.fieldName'), value: data.idea_name },
          { label: t('step4.fieldDescription'), value: data.idea_description },
          { label: t('step4.fieldProblemSolved'), value: data.problem_solved },
        ]}
      />

      <ReviewSection
        title={t('step4.sectionMarket')}
        editLabel={t('step4.edit')}
        onEdit={onBack}
        fields={[
          { label: t('step4.fieldTargetUsers'), value: data.target_users },
          { label: t('step4.fieldCompetitors'), value: data.competitors || t('step4.fieldNoneSpecified') },
          { label: t('step4.fieldMonetization'), value: data.monetization_plan },
        ]}
      />

      <ReviewSection
        title={t('step4.sectionFounder')}
        editLabel={t('step4.edit')}
        onEdit={onBack}
        fields={[
          { label: t('step4.fieldName'), value: data.founder_name },
          { label: t('step4.fieldBackground'), value: data.founder_background },
          { label: t('step4.fieldCommitment'), value: commitmentLabels[data.founder_commitment] },
          { label: 'LinkedIn', value: data.linkedin_url || t('step4.fieldNotProvided') },
        ]}
      />

      <div className="pt-2 border-t border-[#374151]">
        <p className="text-[#6B7280] text-xs font-mono mb-6">
          {t('step4.disclaimer')}
        </p>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="border border-[#374151] text-[#9CA3AF] font-mono px-8 py-3 rounded hover:border-[#6B7280] transition-colors"
          >
            ← {tCommon('back')}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('step4.submitting') : t('step4.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
