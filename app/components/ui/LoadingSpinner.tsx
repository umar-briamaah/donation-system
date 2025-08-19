'use client';

import { memo } from 'react';
import { cn } from '../../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'pulse' | 'dots' | 'bars' | 'spinner';
  className?: string;
  text?: string;
}

const LoadingSpinner = memo(({ 
  size = 'md', 
  variant = 'default', 
  className,
  text 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div className={cn(
            'bg-current rounded-full animate-pulse',
            sizeClasses[size]
          )} />
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'bg-current rounded-full animate-bounce',
                  size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'bg-current animate-pulse',
                  size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-1 h-6' : 'w-2 h-8'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'spinner':
        return (
          <div className={cn(
            'border-2 border-current border-t-transparent rounded-full animate-spin',
            sizeClasses[size]
          )} />
        );
      
      default:
        return (
          <div className={cn(
            'border-2 border-current border-t-transparent rounded-full animate-spin',
            sizeClasses[size]
          )} />
        );
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="text-red-500 dark:text-red-400">
        {renderSpinner()}
      </div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {text}
        </p>
      )}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;

// Full page loading component
export function FullPageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner size="xl" variant="default" text={text} />
    </div>
  );
}

// Inline loading component
export function InlineLoader({ size = 'sm', variant = 'default' }: Omit<LoadingSpinnerProps, 'text' | 'className'>) {
  return <LoadingSpinner size={size} variant={variant} />;
}

// Button loading component
export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center">
      <LoadingSpinner size={size} variant="default" />
      <span className="ml-2">Loading...</span>
    </div>
  );
}
