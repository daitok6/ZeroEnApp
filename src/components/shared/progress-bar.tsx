interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  return (
    <div className="flex items-center w-full mb-8">
      {steps.map((step) => (
        <>
          <div
            key={step}
            className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono transition-all ${
              step < currentStep
                ? 'bg-[#00E87A] border-[#00E87A] text-[#0D0D0D]'
                : step === currentStep
                ? 'border-[#00E87A] text-[#00E87A]'
                : 'border-[#374151] text-[#6B7280]'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < totalSteps && (
            <div
              key={`c-${step}`}
              className={`flex-1 h-px transition-all ${
                step < currentStep ? 'bg-[#00E87A]' : 'bg-[#374151]'
              }`}
            />
          )}
        </>
      ))}
    </div>
  );
}
