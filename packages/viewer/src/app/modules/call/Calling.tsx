import { Emitter } from '@tikkhun/utils-core';
import { DataConnection, MediaConnection } from 'peerjs';
import { toast } from 'sonner';
// import { CallOutView } from "./CallOutView";
import { createCall, updateCall } from '@/api/call';
import { CallModule } from '.';
import { Timer } from '@tikkhun/timer';
import type { UserEntity } from '@/api/user.types';
import { repeat } from '@/utils/repeat';

export interface CallingOptions {
    call: MediaConnection; // 对方通话实例
    conn?: DataConnection; // 对方的消息实例
    user: UserEntity; // 我
    peerUser: UserEntity; // 对方
    localStream: MediaStream; // 本地音视频流
    direction: 'in' | 'out'; // 打入还是打出
    allowAnswer?: () => boolean; // 允许连接
    startedAt?: Date; // 通话开始时间
    timeout: number | false; // 通话未接听超时时间
    ringDuration?: number; // 通话响铃时长
    module: CallModule;
}
export interface NormalizeCallOptions extends Required<Omit<CallingOptions, 'conn'>> {
    conn?: DataConnection;
}
export enum CallingState {
    init = 'init',
    connecting = 'connecting',
    connected = 'connected',
    ended = 'ended',
}
// 每一通通话
export class Calling extends Emitter {
    _state: CallingState = CallingState.init;

    get state() {
        return this._state;
    }
    set state(value: CallingState) {
        this._state = value;
        if (value === CallingState.init) {
            this.emit('init', this);
        } else if (value === CallingState.connecting) {
            this.emit('connecting', this);
        } else if (value === CallingState.connected) {
            this.emit('connected', this);
        } else if (value === CallingState.ended) {
            this.emit('end', this);
        }
    }
    get logger() {
        return this.config.module.logger;
    }
    config: NormalizeCallOptions;
    // status connected end
    get peerId() {
        return this.config.call.peer;
    }
    get localStream() {
        return this.config.localStream;
    }
    pastTime: number = 0;
    _isRing: boolean = true;
    get isRing() {
        return this._isRing;
    }
    set isRing(value: boolean) {
        this._isRing = value;
        this.emit('ring', value);
    }
    remoteStream?: MediaStream;
    get timeout() {
        return this.config.timeout ?? 30_000;
    }

    timer = new Timer({
        ticker: true,
        start: true, // 立即开始
        isOnTime: 'second',
        onTime: (now) => {
            this.pastTime = now - this.config.startedAt.getTime();
            if (this.state === 'connected') {
                return;
            }
            if (this.pastTime >= this.config.ringDuration) {
                this.isRing = false;
            }
            // 停止计时
            if (this.timeout && this.pastTime >= this.timeout) {
                logger.debug('通话实例.通话超时,通话对象id={}', this.peerId);
                this.timer.stop();
                this.onTimeout(now);
                this.end();
            }
        },
    });
    onTimeout(now: number) {
        this.config.module.logger.warn('通话实例.通话超时,通话对象id={}', this.peerId);
        toast.warning(`通话超时, 通话对象id=${this.peerId}`);
        this.emit('timeout', now);
    }

    constructor(config: CallingOptions) {
        super();
        this.config = this.normalizeConfig(config);
        logger.debug('通话实例.初始化, 通话配置为={}', () => JSON.stringify(this.config));
        this.init();
    }
    normalizeConfig(config: CallingOptions) {
        return {
            ...config,
            startedAt: config.startedAt || new Date(),
            timeout: config.timeout ?? false,
            ringDuration: config.ringDuration || 30_000,
            allowAnswer: config.allowAnswer || (() => true),
        };
    }
    init() {
        this.config.conn?.on?.('data', (data: any) => {
            logger.debug(`收到消息, 消息内容={}`, data);
            this.emit('message', data);
        });
        this.config.conn?.on?.('close', () => {
            logger.debug(`消息连接关闭`);
            this.end();
        });
        // watch call
        this.config.call.on('error', this.onError.bind(this));
        this.config.call.on('close', this.onClose.bind(this));
        this.config.call.on('willCloseOnRemote', this.onWillCloseOnRemote.bind(this));
        this.config.call.on('iceStateChanged', this.onIceStateChanged.bind(this));
        this.config.call.on('stream', this.onStream.bind(this));
        //
        this.onInit();
    }
    onWillCloseOnRemote() {
        logger.debug(`willCloseOnRemote`);
    }
    onIceStateChanged(state: string) {
        if (state === 'disconnected') {
            this.end();
        }
        logger.debug(`iceStateChanged, {}`, state);
    }

    private notifyCallIn() {
        if (this.config.direction !== 'in') {
            return;
        }
        // 播放提示音
        if (this.config.module.state.notify.callIn.speak.on) {
            const repeatTimes = this.config.module.state.notify.callIn.speak.repeat;
            repeat(
                () =>
                    this.config.module.speakerModule.speak(`${this.config.peerUser.name} 呼入...`),
                repeatTimes,
            );
        }
        // web notification 通知
        const notifyByWebNotification = async () => {
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                await Notification.requestPermission();
            }
            if (Notification.permission !== 'granted') {
                console.warn('通知被拒绝');
                return;
            }
            const notification = new Notification(`${this.peerId} 呼入...`, {});
            notification.onclick = () => {
                console.log(`被点击了`);
            };
        };
        notifyByWebNotification();
    }

    // private async getRemoteStream() {
    //   return await new Promise((resolve, reject) => {
    //     this.config.call.once("stream", (remoteStream: MediaStream) => {
    //       console.log(`call on stream`);
    //       resolve(remoteStream);
    //     });
    //   });
    // }
    private async onInit() {
        // 仅呼出方记录
        if (this.config.direction === 'out') {
            // 保存呼叫记录
            await this.createRecord();
        }
        // 状态变更
        this.state = CallingState.connecting;
        // 播放提示音
        this.emit('ring', true);
        // 通知一下
        if (this.config.direction === 'in') {
            this.onCallIn();
        } else {
            this.onCallOut();
        }
    }
    onCallIn() {
        this.notifyCallIn();
    }
    onCallOut() {
        this.config.module.app.router.navigate('/calling-out');
    }
    recordId?: number;
    async createRecord() {
        try {
            // 创建呼叫记录
            const result = await createCall({
                from: this.config.user.id,
                to: this.config.peerUser.id,
                connected: false,
                status: this.state,
                startedAt: this.config.startedAt || new Date(),
            });
            this.recordId = result?.id;
            return result;
        } catch (error) {
            this.logger.error('通话实例.创建呼叫记录,但失败,原因为={}', error);
        }
    }
    async updateRecord(id: number, options: any) {
        try {
            await updateCall(id, options);
        } catch (e) {
            this.logger.error('通话实例.更新呼叫记录,但失败,原因为={}', e);
        }
    }

    // 接听
    async answer() {
        logger.info('通话实例,接听.开始,对象为', this.peerId);
        if (this.config.direction !== 'in') {
            return;
        }
        const result = this.config.allowAnswer?.();
        if (!result) {
            toast.warning('如需接听新通话，请先结束当前通话');
            return;
        }
        console.log(`answer`);
        // this.remoteStream = (await this.getRemoteStream()) as MediaStream;

        this.config.call.answer(this.config.localStream);
    }
    hangup() {
        logger.debug('通话实例.挂断,对方id={}', this.peerId);
        this.end();
    }

    private onStream(remoteStream: MediaStream) {
        logger.debug(`通话实例.接收到流,对方id={}`, this.peerId);
        this.remoteStream = remoteStream;
        // 有remote stream意味着已经连接
        this.onConnected();
    }
    private async onConnected() {
        logger.debug(`通话实例.连接到对方,对方id={}`, this.peerId);
        // this.emit('connected', this);
        this.state = CallingState.connected;
        if (this.recordId) {
            await this.updateRecord(this.recordId, { connected: true, status: this.state });
        }
    }

    private async onClose() {
        logger.debug(`通话实例.连接关闭,对方id={}`, this.peerId);
        await this.end();
    }
    private async onError(err: Error) {
        logger.error(`通话实例.连接,但出错,原因为={},对方id={},`, [this.peerId, err.message]);
        await this.end();
    }
    // 停止
    async end() {
        if (this.state == CallingState.ended) {
            logger.debug('通话实例.已挂断,无需再次挂断,对方id={}', this.peerId);
            return;
        }
        // 停止倒计时
        this.timer.stop();
        // 关闭 通话实例
        this.config.call.close();
        this.config.call.removeAllListeners();
        // 关闭 消息实例
        this.config.conn?.close?.();
        // 切换状态
        this.state = CallingState.ended;
        if (this.config.conn) {
            this.config.conn.close();
            this.config.module.dataConnections = this.config.module.dataConnections.filter(
                (conn) => conn.peer !== this.config.conn?.peer,
            );
        }
        // 记录
        if (this.recordId) {
            await this.updateRecord(this.recordId, {
                status: this.state,
                endedAt: new Date(),
                duration: this.pastTime,
            });
        }
        logger.debug('通话实例.挂断,完毕,对方id={}', this.peerId);
    }
}
