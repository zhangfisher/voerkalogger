/*
 * @FilePath: \voerka-phone\projects\web-client\src\components\form\OrderByTimeToggler.tsx
 * @Author: zk.su
 * @Date: 2025-03-21 15:52:28
 * @LastEditTime: 2025-03-21 15:58:06
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file OrderByTimeToggler.tsx
 * @fileBase OrderByTimeToggler
 * @path projects\web-client\src\pages\contacts\OrderByTimeToggler.tsx
 * @from
 * @desc
 * @example
 */
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClockArrowUp, ClockArrowDown } from 'lucide-react';
export interface OrderByTimeTogglerProps {
  value: boolean;
  onToggle: (value: boolean) => void;
}
export const OrderByTimeToggler: React.FC<OrderByTimeTogglerProps> = ({
  value = false,
  onToggle,
}) => {
  return (
    <Button
      onClick={() => {
        onToggle(!value);
      }}
      className={cn('flex-shrink-0', {
        'bg-white dark:bg-dark hover:bg-primary/10 dark:hover:bg-primary/10 text-primary': !value,
      })}>
      {value ? <ClockArrowUp /> : <ClockArrowDown />}
    </Button>
  );
};

// 默认导出
export default OrderByTimeToggler;
