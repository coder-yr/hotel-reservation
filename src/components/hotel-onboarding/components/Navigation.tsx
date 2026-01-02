import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface NavigationProps {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
}

export function Navigation({ currentStep, totalSteps, onNext, onBack }: NavigationProps) {
    return (
        <div className="flex items-center justify-between w-full">
            <button
                onClick={onBack}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-slate-600 font-medium transition-colors
          ${currentStep === 1
                        ? 'opacity-0 pointer-events-none'
                        : 'hover:bg-slate-200 hover:text-slate-900'
                    }`}
            >
                <ArrowLeft className="w-5 h-5" />
                Back
            </button>

            <button
                onClick={onNext}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-200 transition-all hover:shadow-emerald-300 active:scale-95"
            >
                {currentStep === totalSteps ? 'Submit Property' : 'Continue'}
                {currentStep === totalSteps ? (
                    <Check className="w-5 h-5" />
                ) : (
                    <ArrowRight className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}
