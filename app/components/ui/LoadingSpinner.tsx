'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'white';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses = {
  default: 'text-gray-600',
  primary: 'text-red-600',
  secondary: 'text-blue-600',
  white: 'text-white',
};

export default function LoadingSpinner({
  size = 'md',
  variant = 'default',
  text,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2
        className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}
      />
      {text && (
        <p className={`mt-2 text-sm ${variantClasses[variant]} text-center`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full page loading component
export function FullPageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner size="xl" variant="primary" text={text} />
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
      <LoadingSpinner size={size} variant="white" />
      <span className="ml-2">Loading...</span>
    </div>
  );
}
