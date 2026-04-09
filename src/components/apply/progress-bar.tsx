interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono transition-all ${
            step < currentStep
              ? 'bg-[#00E87A] border-[#00E87A] text-[#0D0D0D]'
              : step === currentStep
              ? 'border-[#00E87A] text-[#00E87A]'
              : 'border-[#374151] text-[#6B7280]'
          }`}>
            {step < currentStep ? '✓' : step}
          </div>
          {step < totalSteps && (
            <div className={`h-px w-12 transition-all ${
              step < currentStep ? 'bg-[#00E87A]' : 'bg-[#374151]'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}
