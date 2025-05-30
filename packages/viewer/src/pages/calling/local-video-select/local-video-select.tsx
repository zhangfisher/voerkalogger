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
  onDeviceChange?: (deviceId: string) => void;
}

export const LocalVideoSelect: React.FC<LocalVideoSelectProps> = ({ onDeviceChange }) => {
  const devices = useVideoDevices();
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  useEffect(() => {
    if (selectedDevice) {
      onDeviceChange?.(selectedDevice);
    }
  }, [selectedDevice]);

  return (
    <Select onValueChange={setSelectedDevice} defaultValue={selectedDevice}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="选择摄像头" />
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
