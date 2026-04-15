'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DesignWizard } from './wizard';

interface WizardModalProps {
  userId: string;
  locale: string;
  initialStep: number;
  initialData: Record<string, unknown>;
}

export function WizardModal({ userId, locale, initialStep, initialData }: WizardModalProps) {
  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[#0D0D0D] border border-[#1F2937]"
      >
        <DesignWizard
          initialStep={initialStep}
          initialData={initialData}
          locale={locale}
          userId={userId}
        />
      </DialogContent>
    </Dialog>
  );
}
