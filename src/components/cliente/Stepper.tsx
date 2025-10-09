import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Step {
  id: number;
  nombre: string;
  descripcion: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full py-6 px-4">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all',
                    isCompleted && 'bg-[#1E3A5F] text-white',
                    isCurrent && 'bg-[#1E3A5F] text-white',
                    !isCompleted && !isCurrent && 'bg-gray-300 text-gray-600'
                  )}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : step.id}
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      (isCurrent || isCompleted) ? 'text-[#1E3A5F]' : 'text-gray-500'
                    )}
                  >
                    {step.nombre}
                  </p>
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 mt-[-40px] transition-all',
                    isCompleted ? 'bg-[#1E3A5F]' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
