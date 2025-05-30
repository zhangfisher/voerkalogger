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
    // qvga: { width: 320, height: 240 },
    // vga: { width: 640, height: 480 },
    // hd: { width: 1280, height: 720 },
    // fullHd: { width: 1920, height: 1080 },
    // "4k": { width: 3840, height: 2160 }
import {resolutions} from '@/app/modules/call/consts/resolutions'
export const LocalVideoResolutionSelect: React.FC<LocalVideoResolutionSelectProps> = () => {
  const callStore = useModuleStore<CallModule>('call');
  const [resolution, setResolution] = callStore.useReactive('localVideo.resolution');
  return (
    <Select className="w-auto!" onValueChange={setResolution} defaultValue={resolution}>
      <SelectTrigger className='w-auto'>
        <SelectValue placeholder="选择铃声" />
      </SelectTrigger>
      <SelectContent>
        {resolutions.map((resolution) => {
          return (
            <SelectItem key={resolution.value} value={resolution.value}>
              {resolution.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

// 默认导出
export default LocalVideoResolutionSelect;
