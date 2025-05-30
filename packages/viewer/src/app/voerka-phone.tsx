import { LoadingSpinner } from '@/components/ui/spinner.tsx';
import { ReactApplication, VoerkaApplicationProvider } from '@voerka/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import App from './App';
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
        this.logger.info('生成路由,是否为插件模式={}', this.isPlugin);
        this.router = generateRouter(this.isPlugin ? RouterType.Memory : RouterType.Browser);
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
        const rootId = this.settingManager?.values?.app?.rootId || 'voerka-phone';
        let root = document.getElementById(rootId);
        if (!root) {
            root = document.createElement('div');
            root.id = rootId;
            document.body.append(root);
        }
        return root;
    }
    private _createShadowRoot(root: HTMLElement) {
        const shadowRoot = root.attachShadow({ mode: 'open' });
        return shadowRoot;
    }
    private _insertCss(root: ShadowRoot, cssPath: string) {
        // 创建 <link> 标签并引入外部 CSS 文件
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath; // 替换为你的 CSS 文件路径
        // 将 <link> 标签插入到 Shadow DOM 中
        root.appendChild(link);
    }
    get isPlugin() {
        return this.settingManager?.values?.app?.plugin ?? false;
    }
    private _renderApp() {
        logger.debug('应用.渲染,是否是插件模式={}', this.isPlugin);
        let root = this._getRoot();
        if (this.isPlugin) {
            // const shadowRoot = this._createShadowRoot(root);
            // this.insertCss(shadowRoot, this.settings.app.cssPath);
            // this._render(shadowRoot);
            this._render(root);
        } else {
            this._render(root);
        }
    }
    private _render(root: any) {
        createRoot(root).render(
            <StrictMode>
                <VoerkaApplicationProvider
                    fallback={
                        <div
                            className="flex items-center justify-center h-screen"
                            title="waiting for app started">
                            <LoadingSpinner></LoadingSpinner>
                        </div>
                    }>
                    <App />
                </VoerkaApplicationProvider>
            </StrictMode>,
        );
    }
}
