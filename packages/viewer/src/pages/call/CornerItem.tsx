/**
 * @author
 * @file CornerItem.tsx
 * @fileBase CornerItem
 * @path projects\web-client\src\pages\call\CornerItem.tsx
 * @from
 * @desc
 * @example
 */

import { cn } from '@/app';
import { ClassNameValue } from 'tailwind-merge';

export interface CornerItemProps {
    className?: ClassNameValue;
    children: React.ReactNode;
    item: React.ReactNode;
}
export const CornerItem: React.FC<CornerItemProps> = ({ className, children, item }) => {
    return (
        <div className={cn('relative', className)}>
            {children}
            <div className="absolute top-0 right-0">{item}</div>
        </div>
    );
};

// 默认导出
export default CornerItem;
