/**
 * @author
 * @file local-video-resolution-select.tsx
 * @fileBase local-video-resolution-select
 * @path projects\web-client\src\pages\calling\local-video-resolution-select.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
export interface LocalVideoResolutionSelectProps {
  // value: any
}
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useModuleStore } from '@voerka/react';
import { CallModule } from '@/app';
const layouts = [
  {
    label: '画中画',
    value: 'PiP',
  },
  {
    label: '分栏',
    value: 'split',
  },
];
export const LocalVideoResolutionSelect: React.FC<LocalVideoResolutionSelectProps> = () => {
  const callStore = useModuleStore<CallModule>('call');
  const [layout, setLayout] = callStore.useReactive('layout');
  return (
    <Select onValueChange={setLayout} defaultValue={layout}>
      <SelectTrigger>
        <SelectValue placeholder="选择铃声" />
      </SelectTrigger>
      <SelectContent>
        {layouts.map((layout) => {
          return (
            <SelectItem key={layout.value} value={layout.value}>
              {layout.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

// 默认导出
export default LocalVideoResolutionSelect;
