'use client';

import * as React from 'react';
import { X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HintId, isHintDismissed, dismissHint } from '@/lib/onboarding';

interface OnboardingHintProps {
  id: HintId;
  title: string;
  description: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export function OnboardingHint({
  id,
  title,
  description,
  className,
  variant = 'default'
}: OnboardingHintProps) {
  const [isDismissed, setIsDismissed] = React.useState(true); // Start as dismissed to avoid flash

  // Check dismissal state on mount
  React.useEffect(() => {
    setIsDismissed(isHintDismissed(id));
  }, [id]);

  const handleDismiss = () => {
    dismissHint(id);
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-sm',
          className
        )}
      >
        <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0" />
        <p className="text-blue-900 flex-1">{description}</p>
        <button
          onClick={handleDismiss}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded p-1 transition-colors flex-shrink-0"
          aria-label="Dismiss hint"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm',
        className
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="bg-blue-100 text-blue-700 rounded-full p-2 mt-0.5">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-1">{title}</h3>
          <p className="text-sm text-blue-800">{description}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded p-1.5 transition-colors"
          aria-label="Dismiss hint"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
