/**
 * @author
 * @file local-Audio-select.tsx
 * @fileBase local-Audio-select
 * @path projects\web-client\src\pages\calling\local-Audio-select.tsx
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
import { useAudioDevices } from './useAudioDevices';

export interface LocalAudioSelectProps {
    onDeviceChange?: (deviceId: string) => void;
}

export const LocalAudioSelect: React.FC<LocalAudioSelectProps> = ({ onDeviceChange }) => {
    const devices = useAudioDevices();
    const [selectedDevice, setSelectedDevice] = useState<string>('');

    useEffect(() => {
        if (selectedDevice) {
            onDeviceChange?.(selectedDevice);
        }
    }, [selectedDevice]);

    return (
        <Select onValueChange={setSelectedDevice} defaultValue={selectedDevice}>
            <SelectTrigger className="w-auto">
                <SelectValue placeholder="选择麦克风" />
            </SelectTrigger>
            <SelectContent>
                {devices.length &&
                    devices?.map(({ deviceId, label }) => {
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

export default LocalAudioSelect;
