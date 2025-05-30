import { PeerOptions } from 'peerjs';
import { Calling } from './Calling';

export interface CallModuleState {
    // 通话连接配置(本质是 peer 的配置)
    connectOpts: PeerOptions & { reconnectDelay: number };
    // 通话配置
    // 配置
    localVideo: {
        width: number;
        height: number;
        on: boolean;
        input?: string; // 用来选择哪个摄像头
    };
    localAudio: {
        volume: number;
        on: boolean;
        input?: string; // 麦克风
    };
    remoteVideo: {
        on: boolean;
    };
    remoteAudio: {
        on: boolean;
    };
    answer: {
        auto: boolean;
    };
    hangup: {
        auto: boolean;
        waitTime: number;
    };
    ring: {
        on: boolean;
        value: string;
        duration: number;
    };
    notify: {
        position: string;
        callIn: {
            system: boolean;
            toast: boolean;
            speak: {
                on: boolean;
                repeat: number;
            };
        };
    };
    on: any; // 是否开启
    connectState: string; // 连接状态
    layout: 'split' | 'inset'; // 通话视频布局
    // 流
    localStream?: MediaStream;
    remoteStream?: MediaStream;
    callings: {
        [key: string]: Calling;
    };
    currentCalling: Calling | any | null;
}
