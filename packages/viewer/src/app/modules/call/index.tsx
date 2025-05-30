import { findUser } from '@/api/user';
import { computed, markRaw } from '@autostorejs/react';
import { module, Module, watch, configurable, state } from '@voerka/react';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { toast } from 'sonner';
import { UserModule } from '../user';
import { Calling } from './Calling';
// import { ring, ring2 } from "./consts/audio";
import ringing from '@/assets/audio/ringing.wav';
import { CallModuleState } from './types';
import { markObject } from './markObject';
import { SpeakerModule } from '../speaker';
import { disconnectPeer } from '@/api/peer';
@module({ observable: true, id: 'call' })
export class CallModule extends Module {
    get speakerModule() {
        return this.app.modules.speaker as SpeakerModule;
    }
    state = state<CallModuleState>({
        // 通话连接配置(本质是 peer 的配置)
        connectOpts: {
            host: configurable(import.meta.env.VITE__PEER__SERVER__HOST || 'localhost'),
            port: configurable(import.meta.env.VITE__PEER__SERVER__PORT || '8000'),
            path: configurable(import.meta.env.VITE__PEER__SERVER__PATH || '/peer'),
            reconnectDelay: configurable(10_000),
        },
        // 通话配置
        // 配置
        localVideo: {
            width: configurable(1920),
            height: configurable(1080),
            on: configurable(true),
            // 当前摄像头
            input: configurable(undefined),
        },
        localAudio: {
            volume: configurable(50),
            on: configurable(true), // muted
            input: configurable(undefined),
        },
        remoteVideo: {
            on: configurable(true),
        },
        remoteAudio: {
            on: configurable(true),
        },
        answer: {
            auto: configurable(false),
        },
        hangup: {
            auto: configurable(true),
            waitTime: configurable(60),
        },
        // 响铃
        ring: {
            value: ringing,
            on: configurable(false),
            duration: configurable(60), // s
        },

        layout: configurable('split'), // 界面显示
        notify: {
            position: configurable('top-right'),
            callIn: {
                system: configurable(true), //
                toast: configurable(true),
                speak: {
                    on: configurable(true),
                    repeat: configurable(3),
                },
            },
        },
        on: computed((state) => {
            return state.connectState === 'open';
        }),
        connectState: 'close', // 连接状态
        // 流
        callings: {},
        currentCalling: undefined, // 这种没有的变成有的也无法监听了(除非markLazy)
    });
    // 可供选择的摄像头
    cameras: MediaDeviceInfo[] = [];
    localStream: MediaStream | null = null;
    remoteStream: MediaStream | null = null;
    get userModule() {
        return this.app.modules.user as UserModule;
    }
    get currentPeerId() {
        return this.userModule.state.user?.id;
    }
    peer: Peer | null = null;
    onReady() {
        this.logger.debug('通话.初始化');
        // 创建连接实例
        this.initPeer();
        // 初始化响铃
        this.initRingTone();
    }

    initPeer() {
        this.logger.debug('通话.初始化连接');
        if (this.peer) {
            this.destroyPeer();
        }
        const id = this.currentPeerId;
        if (!id) {
            this.logger.error('通话.连接.初始化,但失败,原因为用户id为空');
            return;
        }
        const { host, port, path } = this.state.connectOpts;
        this.peer = new Peer(id, { host, port, path });
        this.peer.on('error', async (err) => {
            this.logger.error(`通话.连接.异常,原因为 {},错误类型为={}`, [err, err.type]);
            if (err.type === 'network') {
                this.logger.error('通话.连接.初始化,但失败,原因为网络错误');
            } else if (err.type === 'unavailable-id') {
                toast.error('通话连接.初始化,但失败,原因为id不可用', {
                    description: '请尝试重新连接或强制重连',
                });
                this.logger.error('通话.连接.初始化,但失败,原因为id不可用');
            } else if (err.type === 'peer-unavailable' || err.type === 'disconnected') {
                // 无法呼叫对方
                const id = err.message.split('Could not connect to peer ')[1];
                toast.error(`通话,但无法连接对方: ${id}`, {
                    description: err.message,
                });
                this.state.callings[id]?.end?.();
            } else {
                const timeout = this.state.connectOpts.reconnectDelay;
                await new Promise((resolve) => setTimeout(resolve, timeout));
                // 其他问题直接重连
                this.initPeer();
            }
        });
        this.peer.on('disconnected', () => {
            this.logger.info(`通话.连接.断开,账号为: {}`, this.peer?.id);
            // this.state.connectState = 'disconnected';
        });
        this.peer.on('close', () => {
            this.logger.info(`通话.连接.关闭,账号为: {}`, this.peer?.id);
            this.state.connectState = 'close';
        });
        this.peer.on('open', () => {
            this.logger.info(`通话.连接.开启,状态=open,账号为: {}`, this.peer?.id);
            this.state.connectState = 'open';
        });
        this.peer.on('connection', (conn) => {
            logger.debug('通话,收到数据连接请求,数据={}', conn);
            this.dataConnections.push(conn);
        });
        this.peer.socket.on('message', (m) => {
            if (m.event === 'disconnect') {
                this.destroyPeer();
            }
        });
        this.peer.on('call', this.handleCallIn.bind(this));
    }
    async forceInitPeer() {
        try {
            await disconnectPeer(this.currentPeerId);
            this.initPeer();
        } catch (err) {
            this.logger.debug('强制初始化peer失败', err);
        }
    }
    dataConnections: DataConnection[] = [];
    destroyPeer() {
        this.logger.debug(`通话.下线通话连接.开始`);
        this.peer?.disconnect();
        // this.callings 所有的callings 应该删除
        this.peer?.destroy();
        this.logger.debug(`通话.下线通话连接.完毕, {}`, this.store.state.id);
    }
    // 监听用户变更,重新连接
    handleUserChange() {
        this.endCallings();
        this.initPeer();
    }
    endCallings() {
        this.state.callings = {};
        this.state.currentCalling?.end?.();
        this.state.currentCalling = undefined;
    }
    closeAllCallIns() {
        Object.entries(this.state.callings).filter(([peerId, calling]) => {
            calling?.hangup();
        });
    }
    onCallingRingChange() {
        const getShouldRing = () => {
            const callings = Object.values(this.state.callings);
            if (!callings || !callings?.length) {
                return false;
            }
            const hasCallingConnecting = callings.some((calling) => {
                return calling?.state === 'connecting' && calling?.isRing === true;
            });
            const hasCallingConnected = callings.some((calling) => {
                return calling?.state === 'connected';
            });
            this.logger.debug(`通话.检查是否需要响铃,有正在连接中的通话={},没有已连接的通话={}`, [
                hasCallingConnecting,
                !hasCallingConnected,
            ]);
            return hasCallingConnecting && !hasCallingConnected;
        };
        const shouldRing = getShouldRing();
        this.state.ring.on = shouldRing;
    }
    async handleCallIn(call: MediaConnection) {
        try {
            this.logger.debug(`通话.收到通话请求, 账号为={}`, call.peer);
            // 我没有登录
            if (!this.userModule.state.user) {
                return;
            }
            const peerUser = await findUser(call.peer);

            if (!peerUser) {
                this.logger.error(
                    `通话.收到通话请求, 账号为={},但失败,原因为用户不存在`,
                    call.peer,
                );
                return;
            }
            // 启动音视频流
            if (!this.localStream) {
                await this.initLocalStream();
            }
            const conn = this.dataConnections.find((conn) => conn.peer === call.peer);
            // if (!conn) {
            //   return;
            // }
            // 其实可以不监听直接传入CallModule实例便于调用
            // 创建通话实例
            const calling = new Calling({
                user: this.userModule.state.user,
                peerUser: peerUser,
                call,
                conn,
                direction: 'in',
                timeout: this.state.hangup.waitTime * 1000,
                ringDuration: this.state.ring.duration * 1000,
                localStream: this.localStream!,
                allowAnswer: this.checkAllowAnswer.bind(this),
                module: this,
            });
            calling.once('connected', this.onCallingConnect.bind(this));
            calling.once('end', this.onCallingEnd.bind(this));
            calling.once('ring', this.onCallingRingChange.bind(this));
            // 记录新的calling
            this.state.callings = { ...this.state.callings, [call.peer]: markRaw(calling) };
            // 自动接听
            if (this.state.answer.auto && !this.state.currentCalling) {
                this.logger.debug('通话.自动接听');
                calling.answer();
            }
            this.logger.debug('通话.呼入, 通话实例={}', calling);
        } catch (error) {
            this.logger.error(`通话.收到通话请求, 账号为={},但失败,原因为={}`, [call.peer, error]);
            toast.error(`通话,但失败,通话ID=${call.peer}`, {
                description: `${error}`,
            });
            throw error;
        }
    }
    private checkAllowAnswer() {
        const result = !this.state.currentCalling;
        this.logger.debug('通话.检查是否允许接听,结果={}', result);
        return result;
    }
    private readonly ringtone: HTMLAudioElement = new Audio();
    // @ts-ignore
    @watch('ring.value')
    onRingValueChange(state: any) {
        if (!this.state.ring.value) {
            return;
        }
        this.initRingTone();
    }
    initRingTone() {
        try {
            this.logger.debug('通话.响铃.初始化');
            // 先关闭
            if (this.ringtone) {
                this.endRing();
            }
            this.ringtone.src = this.state.ring.value;
            this.ringtone.loop = true;
            // this.ringtone.volume = this.state.callingOpts.localAudio.volume / 100;
        } catch (error) {
            this.logger.error('通话.响铃.初始化,但失败,原因为={}', error);
        }
    }
    private async startRing() {
        try {
            this.logger.debug('通话.响铃.开始');
            await this.ringtone.play();
        } catch (err) {
            this.logger.error(`通话.响铃.开始,但失败,原因为={}`, err);
        }
    }
    private async endRing() {
        try {
            await this.ringtone.pause();
        } catch (err) {
            this.logger.error(`通话.响铃.结束,但失败,原因为={}`, err);
        }
    }
    //@ts-ignore
    @watch('ring.on')
    async onRingChange() {
        this.logger.debug(`通话.响铃.开关变化,状态={}`, this.state.ring.on);
        if (this.state.ring.on) {
            await this.startRing();
        } else {
            await this.endRing();
        }
    }
    @watch('localVideo.resolution')
    onResolutionChange() {
        // 修改 localStream的resolution
        this.localStream;
    }
    // 发起通话
    // startCalling
    async call(id: string) {
        let calling: Calling | undefined = undefined;
        try {
            this.logger.debug(`通话.发起通话, 对方账号为={}`, id);
            if (!this.state.on) {
                this.logger.error(`通话.发起通话,但失败,原因为通话账户未连接`);
                throw new Error('peer is not open');
            }
            if (!this.userModule.state.user) {
                this.logger.error(`通话.发起通话,但失败,原因为未登录用户`);
                throw new Error('user is not defined');
            }
            if (id === this.userModule.state.user?.id) {
                this.logger.error(`通话.发起通话,但失败,原因为不能呼叫自己`);
                throw new Error('user is self');
            }
            const peerUser = await findUser(id);
            if (!peerUser) {
                this.logger.error(`通话.发起通话,但失败,原因为查无此账号,对方账号为={},`, id);
                throw new Error('peer user is not found');
            }
            if (!this.peer) {
                throw new Error('peer is not defined');
            }
            if (!this.localStream) {
                await this.initLocalStream();
            }
            const conn = this.peer.connect(id);
            const call = this.peer.call(id, this.localStream!);
            if (!call) {
                this.logger.error(
                    `通话.发起通话,但失败,原因为对方不在线(没有返回call),对方账号为={},`,
                    id,
                );
                throw new Error(`could not call peer user ${id}`);
            }
            // 创建通话实例
            calling = new Calling({
                user: this.userModule.state.user!,
                peerUser: peerUser,
                call,
                conn,
                direction: 'out',
                localStream: this.localStream!,
                timeout: this.state.hangup.auto ? this.state.hangup.waitTime * 1000 : false,
                ringDuration: this.state.ring.duration * 1000,
                allowAnswer: this.checkAllowAnswer.bind(this),
                module: this,
            });
            calling.once('end', this.onCallingEnd.bind(this));
            calling.once('connected', this.onCallingConnect.bind(this));
            calling.once('ring', this.onCallingRingChange.bind(this));
            this.state.callings = { ...this.state.callings, [id]: markRaw(calling) };
            this.state.currentCalling = markObject(calling);
            this.logger.debug('通话.呼出, 通话实例={}', calling);
            return calling;
        } catch (error: any) {
            logger.error('通话模块.发起通话,但失败,原因为={}', error);
            toast.error('通话呼出失败', { description: error.message });
            if (calling) {
                calling.end();
            } else {
                this.onCallingEnd();
            }
            // this.onCallingEnd(calling);
            return error;
        }
    }
    onCallingConnect(calling: Calling) {
        this.logger.debug(`通话.通话开始,通话实例={}`, calling);
        if (!this.state.currentCalling) {
            this.state.currentCalling = markObject(calling);
        }
        // 这只是为了触发更新
        this.state.callings = this.state.callings;
        this.onCallingRingChange();
        this.goToCalling();
    }
    goToCalling() {
        if (this.app.router.pathname === '/calling') {
            this.logger.debug('通话.通话开始.当前页面已经在通话页面,无需跳转');
            return;
        }
        this.logger.debug('通话.通话开始.跳转页面');
        this.app.router.navigate('/calling');
    }
    onCallingEnd(calling?: Calling) {
        this.logger.debug(`通话.通话结束,通话实例={}`, calling);
        // 关闭响铃
        this.logger.debug('通话.通话实例.结束.关闭响铃');
        this.onCallingRingChange();
        // 当所有calling清空的时候
        if (calling) {
            this.logger.debug('通话.通话实例.结束.删除存储对应的通话实例');
            // 删除对应的calling
            delete this.state.callings[calling!.config.peerUser.id];
            this.state.callings = this.state.callings;
            // 如何定位通话是同一通
            // TODO (最好搞个id)
            if (this.state.currentCalling?.peerId === calling?.peerId) {
                this.logger.debug('通话.通话实例.结束.删除当前通话实例');
                this.state.currentCalling = undefined;
            }
        }
        if (!Object.keys(this.state.callings).length) {
            this.logger.debug('通话.通话实例.结束.停止本地流');
            // 关闭本地流
            this.stopStream();
        }
    }
    getVideoConstraint({
        width,
        height,
        deviceId,
        on,
    }: {
        width: number;
        height: number;
        deviceId: string | undefined;
        on: boolean;
    }) {
        if (!on) {
            return false;
        }
        if (!width && !height && !deviceId) {
            return true;
        }
        const constraint: any = {};
        if (width) {
            constraint['width'] = width;
        }
        if (height) {
            constraint['height'] = height;
        }
        if (deviceId) {
            constraint['deviceId'] = deviceId;
        }
        return constraint;
    }
    @watch('localVideo.on')
    async initLocalStream() {
        this.logger.debug('通话.本地音视频流.初始化.开始,localVideo={},localAudio={}', () => [
            JSON.stringify(this.state.localVideo),
            JSON.stringify(this.state.localAudio),
        ]);
        const videoDevice = this.state.localVideo.input;
        const audioDevice = this.state.localAudio.input;
        const width = this.state.localVideo.width;
        const height = this.state.localVideo.height;
        this.localStream = await navigator.mediaDevices.getUserMedia({
            video: this.getVideoConstraint({
                width,
                height,
                deviceId: videoDevice,
                on: this.state.localVideo.on,
            }),
            audio: this.state.localAudio.on
                ? audioDevice
                    ? { deviceId: audioDevice }
                    : true
                : false,
        });
        this.logger.debug('通话.本地音视频流.初始化.完毕');
        return this.localStream;
    }
    stopStream() {
        this.logger.debug(`通话.清除本地音视频流`);
        if (this.localStream) {
            const tracks = this.localStream.getTracks();
            tracks.forEach((track) => track.stop());
            this.localStream = null;
        }
    }
}
