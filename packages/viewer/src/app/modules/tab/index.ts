import { module, Module, VoerkaModuleOptions, watch, state } from '@voerka/react';
import { CallModule } from '../call';
@module({ observable: true, id: 'tab' })
export class TabModule extends Module {
    state = state({
        isActive: document.visibilityState === 'visible',
        isLastActive: document.visibilityState === 'visible',
    });
    channel = new BroadcastChannel('active');
    constructor(options?: VoerkaModuleOptions) {
        super(options);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }
    async onReady() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        this.channel.addEventListener('message', this.handleMessage);
        // 第一次也需要发送
        this.channel.postMessage({ type: 'active', isActive: this.state.isActive });
    }
    onStop() {
        console.log(`onStop`);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        this.channel.removeEventListener('message', this.handleMessage);
        this.channel.close();
    }
    handleVisibilityChange() {
        // console.log(`document.visibilitychange`, document.visibilityState);
        this.state.isActive = document.visibilityState === 'visible';
        this.channel.postMessage({ type: 'active', isActive: this.state.isActive });
    }
    handleMessage(event: any) {
        // console.log(`event`, event);
        if (event.data.type === 'active') {
            if (this.state.isActive) {
                this.state.isLastActive = true;
            } else {
                this.state.isLastActive = false;
            }
        }
    }

    get callModule() {
        return this.app.modules.call as CallModule;
    }
    // @ts-ignore
    @watch('isActive')
    onActiveChange() {
        if (this.state.isActive) {
            this.logger.debug('在线变更,状态为={}', this.state.isActive);
            this.channel.postMessage('active');
            this.state.isLastActive = true;
        }
    }
    // @ts-ignore
    @watch('isLastActive')
    onLastActiveChange() {
        this.logger.debug('最后在线变更,状态为={}', this.state.isLastActive);
        if (this.state.isActive) {
            this.callModule.initPeer();
        } else {
            this.callModule.destroyPeer();
        }
    }
    // 创建或获取BroadcastChannel
    getBroadcastChannel() {
        if (typeof window === 'undefined') return null;
        return new BroadcastChannel('active');
    }
}
