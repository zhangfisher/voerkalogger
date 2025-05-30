/**
 * @author
 * @file MenuItem.tsx
 * @fileBase MenuItem
 * @path projects\web-client\src\components\app-sidebar\MenuItem.tsx
 * @from
 * @desc
 * @example
 */

import { cn } from '@/app';
import { useState, useEffect, memo, ReactNode } from 'react';
import { ClassNameValue } from 'tailwind-merge';
import { Button } from '../ui/button';
export interface MenuItemProps {
  isActive?: boolean;
  className?: ClassNameValue;
  children?: ReactNode;
}
export const MenuItem: React.FC<MenuItemProps> = ({ className, isActive, children }) => {
  return (
    <Button
      className={cn(
        'rounded bg-muted cursor-auto bg-white dark:bg-black text-black dark:text-white hover:bg-secondary p-3',
        className,
        { 'bg-primary hover:bg-secondary-foreground text-primary-foreground': isActive },
      )}>
      {children}
    </Button>
  );
};

// 默认导出
export default MenuItem;
