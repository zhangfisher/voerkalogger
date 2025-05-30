/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\call\CallSearchBar.tsx
 * @Author: zk.su
 * @Date: 2025-03-21 13:54:48
 * @LastEditTime: 2025-03-21 16:07:04
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file CallSearchBar.tsx
 * @fileBase CallSearchBar
 * @path projects\web-client\src\pages\call\CallSearchBar.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { OrderByTimeToggler } from '@/components/form/OrderByTimeToggler';
import { SearchInput } from '@/components/form/SearchInput';
import { ClassNameValue } from 'tailwind-merge';
export interface CallSearchBarProps {
    className?: ClassNameValue;
    filterText: string;
    onFilterTextChange: (value: string) => void;
    orderByTime: boolean;
    onOrderByTimeChange: (value: boolean) => void;
    refresh: () => void;
}
export const CallSearchBar: React.FC<CallSearchBarProps> = ({
    className,
    filterText,
    onFilterTextChange,
    orderByTime,
    onOrderByTimeChange,
    refresh,
}) => {
    return (
        <div
            className={cn(
                'flex flex-wrap @md:flex-nowrap items-center justify-center gap-2',
                className,
            )}>
            {/* 搜索过滤 */}
            <SearchInput
                className="flex-1"
                value={filterText}
                onChange={onFilterTextChange}
                search={refresh}></SearchInput>
            <OrderByTimeToggler
                value={orderByTime}
                onToggle={onOrderByTimeChange}></OrderByTimeToggler>
        </div>
    );
};

// 默认导出
export default CallSearchBar;
