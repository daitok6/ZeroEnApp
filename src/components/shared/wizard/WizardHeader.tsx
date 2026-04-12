import { Progress } from '@/components/ui/progress';
import { t } from './constants';

interface Props {
  locale: string;
  currentStep: number;
  totalSteps: number;
  label?: string;
}

export function WizardHeader({ locale, currentStep, totalSteps, label }: Props) {
  const progressPct = (currentStep / totalSteps) * 100;
  return (
    <div className="mb-6">
      {label && (
        <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-1">{label}</p>
      )}
      <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
        {t(locale, `Step ${currentStep} of ${totalSteps}`, `ステップ ${currentStep} / ${totalSteps}`)}
      </p>
      <Progress value={progressPct} className="h-1 bg-[#1F2937]" />
    </div>
  );
}
