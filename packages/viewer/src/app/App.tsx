/**
 * @author
 * @file App.tsx
 * @fileBase App
 * @path projects\web-client\src\app\App.tsx
 * @from
 * @desc
 * @example
 */

import { useModuleStore, useSettings } from '@voerka/react';
import { App as IndependenceApp } from './as-independence/App';
import { App as PluginApp } from './as-plugin/App';
export interface AppProps {
    // value: any
}
export const App: React.FC<AppProps> = () => {
    const appStore = useModuleStore('app');
    const [isPlugin] = appStore.useReactive('plugin');
    logger.debug('应用.渲染,是否是插件模式={}', JSON.stringify(isPlugin));
    if (isPlugin) {
        return <PluginApp />;
    }
    return <IndependenceApp />;
};

// 默认导出
export default App;
