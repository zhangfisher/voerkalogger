/**
 * @author
 * @file panel.tsx
 * @fileBase panel
 * @path projects\web-client\src\pages\settings\panel.tsx
 * @from
 * @desc
 * @example
 */

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { ClassNameValue } from 'tailwind-merge';
export interface PanelProps {
  children: ReactNode;
  className: ClassNameValue;
}
export const Panel: React.FC<PanelProps> = ({ children, className }) => {
  return <div className={cn('p-6 rounded-lg shadow', className)}>{children}</div>;
};

// 默认导出
export default Panel;
