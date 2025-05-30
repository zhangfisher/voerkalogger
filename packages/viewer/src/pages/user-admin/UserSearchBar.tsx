/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\user-admin\UserSearchBar.tsx
 * @Author: zk.su
 * @Date: 2025-03-18 15:05:53
 * @LastEditTime: 2025-03-25 14:30:53
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file UserSearchBar.tsx
 * @fileBase UserSearchBar
 * @path projects\web-client\src\pages\user-admin\UserSearchBar.tsx
 * @from
 * @desc
 * @example
 */

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect, memo, useRef } from 'react';
import { ArrowDownAZ, ArrowDownZA, RotateCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClassNameValue } from 'tailwind-merge';
import { SearchInput } from '@/components/form/SearchInput';
export interface UserSearchBarProps {
  filterText: string;
  onFilterTextChange: (filterText: string) => void;
  isTitleAsc: boolean;
  onIsTitleAscChange: (asc: boolean) => void;
  className: ClassNameValue;
}

export const UserSearchBar: React.FC<UserSearchBarProps> = ({
  filterText,
  onFilterTextChange,
  isTitleAsc,
  onIsTitleAscChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-row flex-wrap @md:flex-nowrap items-center space-x-2 p-2',
        className,
      )}>
      {/* 输入 */}
      <SearchInput
        className="flex-1"
        value={filterText}
        onChange={onFilterTextChange}></SearchInput>
      {/* 排序 */}

      <Button
        className={cn('bg-white hover:bg-gray-50 text-primary', {
          'bg-primary hover:bg-secondary-foreground text-white': isTitleAsc,
        })}
        onClick={() => onIsTitleAscChange(!isTitleAsc)}>
        {isTitleAsc ? <ArrowDownAZ></ArrowDownAZ> : <ArrowDownZA></ArrowDownZA>}
      </Button>
    </div>
  );
};

// 默认导出
export default UserSearchBar;
