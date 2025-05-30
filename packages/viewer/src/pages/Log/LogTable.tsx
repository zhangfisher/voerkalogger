/**
 * @author
 * @file LogTable.tsx
 * @fileBase LogTable
 * @path projects\web-client\src\pages\log\LogTable.tsx
 * @from
 * @desc
 * @example
 */

import { cn } from '@/lib/utils';
import { ClassNameValue } from 'tailwind-merge';
export interface LogTableProps {
  // value: any
  className?: ClassNameValue;
}
export const LogTable: React.FC<LogTableProps> = ({ className }) => {
  return <div className={cn('', className)}>LogTable</div>;
};

// 默认导出
export default LogTable;
