/**
 * @author
 * @file index.tsx
 * @fileBase calling
 * @path projects\web-clien
 * t\src\pages\calling\index.tsx
 * @desc Video calling page component
 */

import { CallModule, cn } from '@/app';
import { useModuleStore } from '@voerka/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import PassedTime from './PassedTime';
import CallingControl from './CallingControl';
export interface CallingProps {}

export const Calling: React.FC<CallingProps> = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    const callStore = useModuleStore<CallModule>('call');
    const [currentCalling] = callStore.useReactive('currentCalling');
    // @ts-ignore
    useEffect(() => {
        if (!currentCalling) {
            logger.warn('通话页面,进入,但无通话实例,退出通话页面');
            navigate('/');
        }
    }, [currentCalling]);
    const [volume, setVolume] = callStore.useReactive('localAudio.volume');
    const [isMicOn, setIsMicOn] = callStore.useReactive('localAudio.on');
    const [isVideoOn, setIsVideoOn] = callStore.useReactive('localVideo.on');
    // @ts-ignore
    // 绑定视频
    useEffect(() => {
        if (localVideoRef.current && currentCalling?.localStream) {
            // @ts-ignore
            localVideoRef.current.srcObject = currentCalling?.localStream;
        }
    }, [currentCalling]);

    useEffect(() => {
        if (remoteVideoRef.current && currentCalling?.remoteStream) {
            remoteVideoRef.current.srcObject = currentCalling?.remoteStream;
        }
    }, [currentCalling?.remoteStream]);
    const handleMicToggle = () => {
        const newMicState = !isMicOn;
        setIsMicOn(newMicState);
        if (currentCalling?.localStream) {
            currentCalling?.localStream.getAudioTracks().forEach((track) => {
                track.enabled = newMicState;
            });
        }
    };

    const handleVideoToggle = () => {
        const newVideoState = !isVideoOn;
        setIsVideoOn(newVideoState);
        if (currentCalling?.localStream) {
            currentCalling?.localStream.getVideoTracks().forEach((track) => {
                track.enabled = newVideoState;
            });
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        if (remoteVideoRef.current) {
            remoteVideoRef.current.volume = newVolume / 100;
        }
    };
    async function handleLocalVideoDeviceChange(deviceId: string) {
        if (!currentCalling?.config) {
            return;
        }
        try {
            logger.debug('通话页面.通话本地流.切换视频设备,设备ID={}', deviceId);
            currentCalling.config.localStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } },
                audio: true,
            });
        } catch (error) {
            logger.error('通话页面.通话本地流.切换视频设备,失败,错误信息={}', error);
        }
    }
    async function handleLocalAudioDeviceChange(deviceId: string) {
        if (!currentCalling) {
            return;
        }
        logger.debug('通话页面.通话本地流.切换音频设备,设备ID={}', deviceId);
        // currentCalling.localStream = await navigator
    }
    function hangup() {
        if (!currentCalling) {
            navigate('/');
        }
        currentCalling?.hangup?.();
    }
    const [isLocalVideoLeft, setIsLocalVideoLeft] = useState(false);
    return (
        <div className="flex flex-col w-full h-full gap-2 p-4 bg-gray-900">
            <div className="flex flex-1 w-full overflow-auto flex-cow align-center">
                {/* Video Container */}
                <div className="relative flex-1">
                    {/* Remote Video (Large) */}
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="object-cover w-full h-full border-2 border-gray-700 rounded-lg"
                    />
                    {/* <div className="absolute text-gray-600 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            对方摄像头未开启
          </div> */}
                    {/* Local Video (Small) */}
                    <div
                        className={cn(
                            'absolute h-1/3  md:h-1/4  w-1/3 md:w-1/4 max-w-96 min-w-28  top-4 right-4',
                            {
                                'left-4 right-auto': isLocalVideoLeft,
                            },
                        )}
                        onClick={() => setIsLocalVideoLeft(!isLocalVideoLeft)}>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="object-cover w-full h-full border-2 border-gray-600 rounded-lg"></video>
                        {!isVideoOn && (
                            <div className="absolute text-gray-600 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                本地摄像头未开启
                            </div>
                        )}
                        {/* 显示人名 */}
                        <div className="absolute left-4 bottom-4">
                            <div className="p-1 px-4 font-bold text-center text-white bg-black rounded-full opacity-75 min-w-30 ">
                                {(currentCalling?.config?.user?.title || '-') + ' (本机)'}
                            </div>
                        </div>
                    </div>
                    {/* 显示姓名 */}
                    <div className="absolute left-4 bottom-4">
                        <div className="p-1 px-4 text-center text-white bg-black rounded-full opacity-75 min-w-30 ">
                            {currentCalling?.config?.peerUser?.title || '-'}
                        </div>
                    </div>
                    {/* 显示时间 */}
                    <div title="通话时长" className="absolute -translate-x-1/2 bottom-4 left-1/2">
                        <div className="p-2 px-4 text-center text-white bg-black rounded-full opacity-75 ">
                            <PassedTime></PassedTime>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <CallingControl
                isMicOn={isMicOn}
                handleMicToggle={handleMicToggle}
                isVideoOn={isVideoOn}
                handleVideoToggle={handleVideoToggle}
                volume={volume}
                handleVolumeChange={handleVolumeChange}
                hangup={hangup}></CallingControl>
        </div>
    );
};
export default Calling;
