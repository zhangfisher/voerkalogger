import { useEffect, useState } from 'react';
import { toast } from 'sonner';
export interface VideoDevice {
    deviceId: string | undefined;
    label: string;
}
export const useVideoDevices = () => {
    const [devices, setDevices] = useState<VideoDevice[]>([]);
    async function getAndSetDevices() {
        try {
            getVideoDevices().then((devices) => {
                setDevices(
                    [{ label: '不限', deviceId: undefined }, ...(devices || [])].filter(
                        (option) => option?.deviceId !== '',
                    ),
                );
            });
        } catch (error) {
            toast.error('获取视频设备失败');
        }
    }
    useEffect(() => {
        getAndSetDevices();
    }, []);
    return devices;
};

// 获取所有视频输入设备
export const getVideoDevices = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices
            .filter((device) => device.kind === 'videoinput')
            .map((device) => ({
                deviceId: device.deviceId,
                label: device.label || `Camera ${device.deviceId.slice(0, 5)}`,
            }));
        return videoDevices;
    } catch (error) {
        console.error('获取视频设备失败:', error);
    }
};
