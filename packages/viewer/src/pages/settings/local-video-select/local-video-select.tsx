/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\settings\local-video-select\local-video-select.tsx
 * @Author: zk.su
 * @Date: 2025-02-26 15:47:56
 * @LastEditTime: 2025-04-18 09:35:31
 * @LastEditors: zk.su
 * @Description: 
 * @TODO: 
 */
/**
 * @author
 * @file local-video-select.tsx
 * @fileBase local-video-select
 * @path projects\web-client\src\pages\calling\local-video-select.tsx
 * @from
 * @desc
 * @example
 */

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVideoDevices } from './useVideoDevices';

export interface LocalVideoSelectProps {
  defaultValue?: string;
  onDeviceChange?: (deviceId: string) => void;
}

export const LocalVideoSelect: React.FC<LocalVideoSelectProps> = ({
  defaultValue,
  onDeviceChange,
}) => {
  const devices = useVideoDevices();
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(defaultValue);

  useEffect(() => {
    if (selectedDevice) {
      onDeviceChange?.(selectedDevice);
    }
  }, [selectedDevice]);

  return (
    <Select onValueChange={setSelectedDevice} defaultValue={selectedDevice}>
      <SelectTrigger className="w-auto">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {devices.map(({ deviceId, label }) => {
          return (
            <SelectItem key={deviceId} value={deviceId}>
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default LocalVideoSelect;
