/**
 * @author
 * @file ContactSearch.tsx
 * @fileBase ContactSearch
 * @path projects\web-client\src\pages\contacts\ContactSearch.tsx
 * @from
 * @desc
 * @example
 */
import { ClassNameValue } from 'tailwind-merge';
import { findManyContact, updateContact } from '@/api/contact';
import { findManyDepts, fuzzyFindByTitle, sync } from '@/api/dept';
import { UserModule } from '@/app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useModuleStore } from '@voerka/react';
import { useInfiniteScroll } from 'ahooks';
import { usePagination } from 'alova/client';
import { ArrowDownAZ, ArrowUpAZ, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Contact, ContactBar } from './ContactBar';
import { UserOrg } from '../UserOrg/UserOrg';
import { OrderByTextToggler } from '@/components/form/OrderByTextToggler';
import { SearchInput } from '@/components/form/SearchInput';
import { StarToggler } from '@/components/form/StarToggler';
import { send } from 'process';

export interface ContactSearchProps {
    className?: ClassNameValue;
    filterText: string;
    onFilterTextChange: (value: string) => void;
    isTitleDesc: boolean;
    onIsTitleDescChange: (value: boolean) => void;
    filterByStar: boolean;
    onFilterByStarChange: (value: boolean) => void;
    loading: boolean;
    refresh: () => void;
}
export const ContactSearch: React.FC<ContactSearchProps> = ({
    className,
    filterText,
    onFilterTextChange,
    isTitleDesc,
    onIsTitleDescChange,
    filterByStar,
    onFilterByStarChange,
    loading = false,
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
                disabled={loading}
                className="flex-1"
                value={filterText}
                onChange={onFilterTextChange}
                search={refresh}></SearchInput>
            <OrderByTextToggler
                disabled={loading}
                value={isTitleDesc}
                onToggle={onIsTitleDescChange}></OrderByTextToggler>
            <StarToggler
                disabled={loading}
                className="bg-white text-primary hover:text-primary/90"
                value={filterByStar}
                onChange={onFilterByStarChange}></StarToggler>
        </div>
    );
};

// 默认导出
export default ContactSearch;
