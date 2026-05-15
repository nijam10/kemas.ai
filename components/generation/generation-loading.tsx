"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStep {
  id: number;
  title: string;
  duration: number; // in seconds
}

const loadingSteps: LoadingStep[] = [
  { id: 1, title: "Checking credits", duration: 2 },
  { id: 2, title: "Sending prompt to AI engine", duration: 3 },
  { id: 3, title: "Generating packaging texture", duration: 8 },
  { id: 4, title: "Applying logo compositing", duration: 4 },
  { id: 5, title: "Preparing preview", duration: 3 },
];

interface GenerationLoadingProps {
  onComplete: () => void;
}

export default function GenerationLoading({ onComplete }: GenerationLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const totalDuration = loadingSteps.reduce((sum, step) => sum + step.duration, 0);
    let elapsedTime = 0;

    // Progress bar animation
    progressTimer = setInterval(() => {
      elapsedTime += 0.1;
      const newProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressTimer);
      }
    }, 100);

    // Step progression
    let cumulativeTime = 0;
    loadingSteps.forEach((step, index) => {
      cumulativeTime += step.duration;
      stepTimer = setTimeout(() => {
        setCurrentStep(index + 1);
        if (index === loadingSteps.length - 1) {
          setTimeout(() => {
            onComplete();
          }, 500);
        }
      }, cumulativeTime * 1000);
    });

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <div className="bg-white border border-[#E5E4E0] rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F97316]/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#F97316] animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
          Generating your design
        </h3>
        <p className="text-sm text-[#737373]">
          This usually takes 15-20 seconds
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-[#E5E4E0] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#F97316] to-[#FACC15] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[#737373] text-center mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {loadingSteps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                isActive && "bg-[#F97316]/5 border border-[#F97316]/20",
                isCompleted && "bg-[#FACC15]/5",
                isPending && "opacity-40"
              )}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-[#FACC15]" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-[#F97316] animate-spin" />
                ) : (
                  <Clock className="w-5 h-5 text-[#A3A3A3]" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isActive && "text-[#F97316]",
                    isCompleted && "text-[#1A1A1A]",
                    isPending && "text-[#737373]"
                  )}
                >
                  {step.title}
                </p>
              </div>
              {isActive && (
                <span className="text-xs font-medium text-[#F97316]">
                  Processing...
                </span>
              )}
              {isCompleted && (
                <span className="text-xs font-medium text-[#FACC15]">
                  Done
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
