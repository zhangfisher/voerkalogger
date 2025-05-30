/*
 * @FilePath: \voerka-phone\projects\web-client\src\components\form\SearchInput.tsx
 * @Author: zk.su
 * @Date: 2025-03-21 13:56:54
 * @LastEditTime: 2025-03-21 16:18:50
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file SearchInput.tsx
 * @fileBase SearchInput
 * @path projects\web-client\src\pages\call\SearchInput.tsx
 * @from
 * @desc
 * @example
 */

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { ClassNameValue } from 'tailwind-merge';
import { cn } from '@/lib/utils';
export interface SearchInputProps {
    className?: ClassNameValue;
    value: string;
    onChange: (value: string) => void;
    search?: Function;
    disabled?: boolean;
    [key: string]: any;
}
export const SearchInput: React.FC<SearchInputProps> = ({
    className,
    value,
    onChange,
    search,
    disabled,
    ...props
}) => {
    const input = useRef<HTMLInputElement>(null);
    return (
        <div className={cn('flex gap-2 items-center', className)}>
            <Input
                {...props}
                className="flex-1"
                ref={input}
                value={value}
                onChange={(e) => onChange(e.target.value)}></Input>
            {!value && (
                <Button
                    disabled={disabled}
                    className="bg-white hover:bg-gray-100 text-primary"
                    onClick={() => search?.()}>
                    <Search></Search>
                </Button>
            )}
            {!!value && (
                // 删除搜索文本
                <Button
                    disabled={disabled}
                    className="bg-white hover:bg-gray-100 text-primary"
                    onClick={() => {
                        onChange('');
                        input.current?.focus?.();
                    }}>
                    <X></X>
                </Button>
            )}
        </div>
    );
};

// 默认导出
export default SearchInput;
