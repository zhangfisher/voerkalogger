import { configurable, module, Module, state } from '@voerka/react';
@module({ id: 'app' })
export class AppModule extends Module {
    state = state({
        title: configurable('日志查看器'),
        rootId: configurable('voerka-logger'),
    });
}
