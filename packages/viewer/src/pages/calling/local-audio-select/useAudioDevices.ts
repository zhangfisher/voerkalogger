import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface AudioDevice {
  deviceId: string;
  label: string;
}

export const useAudioDevices = () => {
  const [devices, setDevices] = useState<AudioDevice[]>([]);

  async function getAndSetDevices() {
    try {
      getAudioDevices().then((devices) => {
        setDevices(devices || []);
      });
    } catch (error) {
      toast.error('获取音频设备失败');
    }
  }

  useEffect(() => {
    getAndSetDevices();
  }, []);

  return devices;
};

// 获取所有音频输入设备
export const getAudioDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices
      .filter((device) => device.kind === 'audioinput')
      .map((device) => ({
        deviceId: device.deviceId,
        label: device.label || `Microphone ${device.deviceId.slice(0, 5)}`,
      }));
    return audioDevices;
  } catch (error) {
    console.error('获取音频设备失败:', error);
  }
};
