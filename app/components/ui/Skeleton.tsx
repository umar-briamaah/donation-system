'use client';

import { memo } from 'react';
import { cn } from '../../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animated?: boolean;
}

const Skeleton = memo(({ 
  className, 
  variant = 'text', 
  width, 
  height, 
  lines = 1,
  animated = true 
}: SkeletonProps) => {
  const baseClasses = cn(
    'bg-gray-200 dark:bg-gray-700',
    animated && 'animate-pulse',
    className
  );

  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-lg';
      case 'rectangular':
        return 'rounded-none';
      default:
        return 'rounded';
    }
  };

  const getDimensions = () => {
    const style: React.CSSProperties = {};
    
    if (width) {
      style.width = typeof width === 'number' ? `${width}px` : width;
    }
    
    if (height) {
      style.height = typeof height === 'number' ? `${height}px` : height;
    }
    
    return style;
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              getVariantClasses(),
              'h-4',
              index === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, getVariantClasses())}
      style={getDimensions()}
    />
  );
});

Skeleton.displayName = 'Skeleton';

// Predefined skeleton components for common use cases
export const SkeletonText = memo(({ lines = 3, className }: { lines?: number; className?: string }) => (
  <Skeleton variant="text" lines={lines} className={className} />
));

SkeletonText.displayName = 'SkeletonText';

export const SkeletonAvatar = memo(({ size = 40, className }: { size?: number; className?: string }) => (
  <Skeleton variant="circular" width={size} height={size} className={className} />
));

SkeletonAvatar.displayName = 'SkeletonAvatar';

export const SkeletonCard = memo(({ className }: { className?: string }) => (
  <div className={cn('space-y-3', className)}>
    <Skeleton variant="rectangular" height={200} className="w-full" />
    <SkeletonText lines={2} />
    <div className="flex space-x-2">
      <Skeleton width={60} height={24} />
      <Skeleton width={80} height={24} />
    </div>
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonTable = memo(({ rows = 5, columns = 4, className }: { rows?: number; columns?: number; className?: string }) => (
  <div className={cn('space-y-2', className)}>
    {/* Header */}
    <div className="flex space-x-2">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} height={20} className="flex-1" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-2">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} height={16} className="flex-1" />
        ))}
      </div>
    ))}
  </div>
));

SkeletonTable.displayName = 'SkeletonTable';

export const SkeletonList = memo(({ items = 5, className }: { items?: number; className?: string }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4">
        <SkeletonAvatar size={40} />
        <div className="flex-1 space-y-2">
          <Skeleton height={16} className="w-3/4" />
          <Skeleton height={14} className="w-1/2" />
        </div>
      </div>
    ))}
  </div>
));

SkeletonList.displayName = 'SkeletonList';

export const SkeletonForm = memo(({ fields = 4, className }: { fields?: number; className?: string }) => (
  <div className={cn('space-y-6', className)}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton height={16} className="w-24" />
        <Skeleton height={40} className="w-full" />
      </div>
    ))}
    <div className="flex space-x-3">
      <Skeleton width={100} height={40} />
      <Skeleton width={80} height={40} />
    </div>
  </div>
));

SkeletonForm.displayName = 'SkeletonForm';

export default Skeleton;
