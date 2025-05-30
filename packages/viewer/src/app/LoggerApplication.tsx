import { LoadingSpinner } from '@/components/ui/spinner.tsx';
import { ReactApplication, VoerkaApplicationProvider } from '@voerka/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import App from './App.tsx';
import { generateRouter, RouterType } from './router.tsx';

// 这里只不过补充useApp 的一些类型提醒
declare module '@voerka/react' {
    interface VoerkaApplication {
        router: any;
    }
}
export class VoerkaPhone extends ReactApplication {
    router: any;
    
    // 应用启动时
    onCreate = () => {
        this.logger.info('项目启动');
    };

    private _initRouter() {
        this.router = generateRouter(RouterType.Memory);
        this.logger.info(`路由生成完毕`, this.router);
    }
    onReady() {
        this.logger.debug('项目准备就绪');
        this._initRouter();
        this._renderApp();
    }
    // onStart() {
    //     this.logger.debug('项目启动');
    // }
    private _getRoot() {
        const rootId = this.settings?.app?.rootId || 'voerka-logger';
        let root = document.getElementById(rootId);
        if (!root) {
            root = document.createElement('div');
            root.id = rootId;
            document.body.append(root);
        }
        return root;
    }
    private _renderApp() {
        let root = this._getRoot();
        this._render(root);
    }
    private _render(root: any) {
        createRoot(root).render(
            <StrictMode>
                <VoerkaApplicationProvider
                    fallback={
                        <div className="flex items-center justify-center h-screen" title="waiting for app started">
                            <LoadingSpinner></LoadingSpinner>
                        </div>
                    }>
                    <App />
                </VoerkaApplicationProvider>
            </StrictMode>,
        );
    }
}
