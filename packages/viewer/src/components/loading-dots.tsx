// LoadingDots.tsx
import { cn } from '@/lib/utils';
import React from 'react';

interface LoadingDotsProps {
    className?: string;
    color?: string;
    delay?: number;
}
export const LoadingDots: React.FC<LoadingDotsProps> = ({
    className,
    color = 'white',
    delay = 0.2,
}) => {
    const bg = `bg-${color}`;
    return (
        <div className={cn('flex space-x-2', className)}>
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className={cn('w-2 h-2 rounded-full animate-pulse', bg)}
                    style={{
                        animationDelay: `${i * delay}s`,
                    }}
                />
            ))}
        </div>
    );
};
