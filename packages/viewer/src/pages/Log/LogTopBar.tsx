/**
 * @author
 * @file LogTopBar.tsx
 * @fileBase LogTopBar
 * @path projects\web-client\src\pages\log\LogTopBar.tsx
 * @from
 * @desc
 * @example
 */

import { MultiSelect } from '@/components/form/MultiSelect';
import { SearchInput } from '@/components/form/SearchInput';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RotateCw } from 'lucide-react';
import { useState } from 'react';
import { OrderByTimeToggler } from '@/components/form/OrderByTimeToggler';

export interface LogTopBarProps {
  filterText: string;
  onFilterTextChange: (value: string) => void;
  refresh: () => void;
  selectedLevels: string[];
  setSelectedLevels: (value: string[]) => void;
  isAsc: boolean;
  setIsAsc: (value: boolean) => void;
}
export const levelOptions = ['debug', 'info', 'warn', 'error', 'fatal'];
export const LogTopBar: React.FC<LogTopBarProps> = ({
  filterText,
  onFilterTextChange,
  selectedLevels,
  setSelectedLevels,
  refresh,
  isAsc,
  setIsAsc,
}) => {
  return (
    <div className="flex flex-row space-x-2">
      {/* 搜索查询 */}
      {/* <SearchInput
        placeholder="搜索日志..."
        className="w-full"
        value={filterText}
        onChange={onFilterTextChange}></SearchInput> */}
      {/* 错误类型 */}
      <MultiSelect
        className="w-auto"
        options={levelOptions}
        selectedItems={selectedLevels}
        setSelectedItems={setSelectedLevels}></MultiSelect>
      {/* 时间范围 */}
      {/* 排序 */}
      <OrderByTimeToggler value={!isAsc} onToggle={() => setIsAsc(!isAsc)}></OrderByTimeToggler>

      {/* 刷新 */}
      <Button className={cn('bg-white hover:bg-gray-50 text-primary')} onClick={refresh}>
        <RotateCw />
      </Button>
    </div>
  );
};

// 默认导出
export default LogTopBar;
