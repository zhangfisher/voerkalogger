/**
 * @author
 * @file select-input.tsx
 * @fileBase select-input
 * @path packages\ui-shadcn\src\form\select-input.tsx
 * @from
 * @desc
 * @example
 */

import React, { useState, memo } from 'react';
// 引入 Shadcn UI 组件
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

const PureSelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger ref={ref} {...props}>
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className="w-4 h-4 opacity-50" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));

// 定义组件属性
export interface SelectInputProps {
    options: any[];
    value: any;
    onChange: (value: any) => void;
    [key: string]: any;
}

export const SelectInput: React.FC<SelectInputProps> = ({ options, value, onChange, ...props }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
    };

    const handleSelectChange = (selectedValue: string) => {
        setInputValue(selectedValue);
        onChange(selectedValue);
    };

    return (
        <Select value={inputValue} onValueChange={handleSelectChange}>
            <div className="flex flex-row justify-center ">
                <Input {...props} value={value} onChange={handleInputChange}></Input>
                <PureSelectTrigger>
                    {/* <SelectValue inputMode="numeric" placeholder="请选择或输入" /> */}
                </PureSelectTrigger>
            </div>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

// 默认导出
export default SelectInput;
