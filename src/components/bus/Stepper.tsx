"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: { number: number; title: string }[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-8">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.number} className="flex-1 flex items-center">
            <div className="relative flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10",
                isCompleted ? "bg-green-500 border-green-500 text-white" :
                  isCurrent ? "bg-white border-primary text-primary" :
                    "bg-white border-slate-300 text-slate-300"
              )}>
                {isCompleted ? <Check className="w-6 h-6" /> : step.number}
              </div>
              <span className={cn(
                "absolute top-12 text-sm font-medium whitespace-nowrap",
                isCompleted || isCurrent ? "text-slate-900" : "text-slate-400"
              )}>
                {step.title}
              </span>
            </div>
            {!isLast && (
              <div className={cn(
                "h-1 flex-1 mx-4 rounded",
                isCompleted ? "bg-green-500" : "bg-slate-200"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
