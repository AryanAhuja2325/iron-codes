import React from 'react';

type SkeletonType = 'text' | 'title' | 'card' | 'avatar' | 'tableRow';

interface SkeletonLoaderProps {
  className?: string;
  type?: SkeletonType;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  type = 'text',
}) => {
  const baseClasses = 'relative overflow-hidden bg-gray-200 rounded';

  const typeClasses: Record<SkeletonType, string> = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    card: 'h-32 w-full rounded-xl',
    avatar: 'h-10 w-10 rounded-full',
    tableRow: 'h-12 w-full',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
    </div>
  );
};

export default SkeletonLoader;