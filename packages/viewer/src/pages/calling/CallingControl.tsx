/**
 * @author
 * @file CallingControl.tsx
 * @fileBase CallingControl
 * @path projects\web-client\src\pages\calling\CallingControl.tsx
 * @from
 * @desc
 * @example
 */

import { cn } from '@/app';
import { Button } from '@/components/ui/button';
import { VolumeSlider } from '@/components/volume-slider';
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';
export interface CallingProps {}
export interface CallingControlProps {
    isMicOn: boolean;
    handleMicToggle: () => void;
    isVideoOn: boolean;
    handleVideoToggle: () => void;
    volume: number;
    handleVolumeChange: (newVolume: number) => void;
    hangup: () => void;
}
export const CallingControl: React.FC<CallingControlProps> = ({
    isMicOn,
    handleMicToggle,
    isVideoOn,
    handleVideoToggle,
    volume,
    handleVolumeChange,
    hangup,
}) => {
    return (
        <div className="flex items-center justify-center py-6 space-x-6 bg-gray-800 rounded-lg">
            <Button
                variant={isMicOn ? 'default' : 'destructive'}
                size="lg"
                onClick={handleMicToggle}
                className={cn(`rounded-full p-4`, {
                    'bg-white hover:bg-gray-100 text-black': isMicOn,
                })}>
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
            </Button>

            <Button
                variant={isVideoOn ? 'default' : 'destructive'}
                size="lg"
                onClick={handleVideoToggle}
                className={cn(`rounded-full p-4`, {
                    'bg-white hover:bg-gray-100 text-black': isVideoOn,
                })}>
                {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
            </Button>
            {/* 视频分辨率设置 */}
            {/* <LocalVideoResolutionSelect></LocalVideoResolutionSelect> */}
            {/* 视频设备设置 */}
            {/* <LocalVideoSelect onDeviceChange={handleLocalVideoDeviceChange}></LocalVideoSelect> */}
            {/* 音频设备设置 */}
            {/* <LocalAudioSelect onDeviceChange={handleLocalAudioDeviceChange}></LocalAudioSelect> */}
            <div className="flex items-center space-x-2 min-w-[200px]">
                <VolumeSlider value={volume} onValueChange={handleVolumeChange}></VolumeSlider>
            </div>

            <Button variant="destructive" size="lg" onClick={hangup} className="p-4 rounded-full">
                <PhoneOff size={24} />
                结束通话
            </Button>
        </div>
    );
};

// 默认导出
export default CallingControl;
