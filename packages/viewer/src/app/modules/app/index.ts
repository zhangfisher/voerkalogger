import { alovaInstance } from '@/api/alova';
import { configurable, module, Module, watch, state, listen } from '@voerka/react';
@module({ id: 'app' })
export class AppModule extends Module {
    state = state({
        entryButtonPosition: configurable('bottom-right'), // 这是位置 如果全局的则没有
        title: configurable('通话应用'),
        lastVersion: configurable(''), // 这个可以申请
        baseURL: configurable('/api'),
        plugin: configurable(false),
        rootId: configurable('voerka-phone'),
        cssPath: configurable('./index.css'),
    });
    // 目前 observabled 是在 onReady 之后才执行,所以需要监听,否则 baseURL是个对象而不是值
    @listen('observabled')
    @watch('baseURL')
    updateBaseURL() {
        logger.debug('更新baseURL,typeof baseURL={},baseURL={}', [
            typeof this.state.baseURL,
            this.state.baseURL,
        ]);
        alovaInstance.options.baseURL = this.state.baseURL || '';
    }
}
