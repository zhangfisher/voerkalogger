/**
 * @author
 * @file not-read-count-bedge.tsx
 * @fileBase not-read-count-bedge
 * @path projects\web-client\src\components\app-sidebar\not-read-count-bedge.tsx
 * @from
 * @desc
 * @example
 */

import { cn } from '@/app';
export interface CountBadgeProps {
  value: number;
  maxValue?: number;
  className?: string;
}
export const CountBadge: React.FC<CountBadgeProps> = ({ value, maxValue, className }) => {
  maxValue = maxValue ?? 999; // 
  return (
    <div
      className={cn(
        'px-1 text-xs text-center text-white scale-75 bg-red-500 rounded-full min-w-4',
        className,
      )}>
      <span>{value > maxValue ? '999+' : value}</span>
    </div>
  );
};

// 默认导出
export default CountBadge;
