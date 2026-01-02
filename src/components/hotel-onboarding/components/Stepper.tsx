import React from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

interface StepperProps {
    currentStep: number;
    totalSteps: number;
}

export function Stepper({ currentStep, totalSteps }: StepperProps) {
    const steps = [
        { id: 1, label: 'Basic Info' },
        { id: 2, label: 'Facilities' },
        { id: 3, label: 'Rooms' },
        { id: 4, label: 'Documents' },
    ];

    return (
        <div className="w-full">
            <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
                {/* Connecting Lines */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-500 ease-in-out"
                        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    />
                </div>

                {steps.map((step) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const isPending = currentStep < step.id;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-3 bg-slate-50 px-2">
                            <div
                                className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ring-4 ring-slate-50",
                                    isCompleted ? "bg-emerald-500 text-white ring-emerald-100" :
                                        isCurrent ? "bg-emerald-600 text-white ring-emerald-100 scale-110 shadow-lg shadow-emerald-200" :
                                            "bg-slate-200 text-slate-500"
                                )}
                            >
                                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                            </div>
                            <span className={clsx(
                                "text-sm font-medium transition-colors duration-300 hidden md:block",
                                isCurrent || isCompleted ? "text-emerald-700" : "text-slate-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
