/*
 * @FilePath: \voerka-phone\projects\web-client\src\components\form\OrderByTextToggler.tsx
 * @Author: zk.su
 * @Date: 2025-03-21 11:50:22
 * @LastEditTime: 2025-03-21 16:03:18
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file OrderByTextToggler.tsx
 * @fileBase OrderByTextToggler
 * @path projects\web-client\src\pages\contacts\OrderByTextToggler.tsx
 * @from
 * @desc
 * @example
 */
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
export interface OrderByTextTogglerProps {
    value: boolean;
    onToggle: (value: boolean) => void;
    disabled?: boolean;
}
export const OrderByTextToggler: React.FC<OrderByTextTogglerProps> = ({
    value,
    onToggle,
    ...props
}) => {
    return (
        <Button
            {...props}
            onClick={() => {
                onToggle(!value);
            }}
            className={cn('flex-shrink-0', {
                'bg-white dark:bg-dark hover:bg-primary/10 dark:hover:bg-primary/10 text-primary':
                    !value,
            })}>
            {value ? <ArrowUpAZ /> : <ArrowDownAZ />}
        </Button>
    );
};

// 默认导出
export default OrderByTextToggler;
