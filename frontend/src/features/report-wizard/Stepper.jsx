import React from 'react';
import { Check } from 'lucide-react';

export const Stepper = ({ currentStep }) => {
  const steps = [
    { id: 0, label: 'Репозиторий' },
    { id: 1, label: 'Параметры' },
    { id: 2, label: 'Готово' }
  ];

  return (
    <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Иконка шага */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep > step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : currentStep === step.id 
                    ? 'bg-white border-blue-600 text-blue-600 shadow-md shadow-blue-100' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {currentStep > step.id ? <Check size={20} strokeWidth={3} /> : <span>{step.id + 1}</span>}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                currentStep === step.id ? 'text-blue-600' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>

            {/* Линия между шагами */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 bg-slate-200 relative -top-3">
                <div 
                  className="absolute inset-0 bg-blue-600 transition-all duration-500"
                  style={{ width: currentStep > step.id ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};