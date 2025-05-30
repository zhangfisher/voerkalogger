import { type IAppEvent, listen, module, Module, watch, configurable, state } from '@voerka/react';

@module({ observable: true, id: 'theme' })
export class ThemeModule extends Module {
    state = state({
        followSystem: configurable(false),
        dark: configurable(false),
        cssVariables: {
            // '--background': configurable('0 0% 100%'),
            // '--foreground': configurable('222.2 84% 4.9%'),
            // '--card': configurable('0 0% 100%'),
            // '--card-foreground': configurable('222.2 84% 4.9%'),
            // '--popover': configurable('0 0% 100%'),
            // '--popover-foreground': configurable('222.2 84% 4.9%'),
            // '--primary': configurable('221.2 83.2% 53.3%'),
            // '--primary-foreground': configurable('210 40% 98%'),
            // '--secondary': configurable('210 40% 96.1%'),
            // '--secondary-foreground': configurable('222.2 47.4% 11.2%'),
            // '--muted': configurable('210 40% 96.1%'),
            // '--muted-foreground': configurable('215.4 16.3% 46.9%'),
            // '--accent': configurable('210 40% 96.1%'),
            // '--accent-foreground': configurable('222.2 47.4% 11.2%'),
            // '--destructive': configurable('0 84.2% 60.2%'),
            // '--destructive-foreground': configurable('210 40% 98%'),
            // '--border': configurable('214.3 31.8% 91.4%'),
            // '--input': configurable('214.3 31.8% 91.4%'),
            // '--ring': configurable('221.2 83.2% 53.3%'),
            // '--radius': configurable('0.5rem'),
            // '--chart-1': configurable('12 76% 61%'),
            // '--chart-2': configurable('173 58% 39%'),
            // '--chart-3': configurable('197 37% 24%'),
            // '--chart-4': configurable('43 74% 66%'),
            // '--chart-5': configurable('27 87% 67%'),
        },
    });
    onReady() {
        this.logger.debug('主题模块初始化完成');
        this.changeCssVariables(this.state.cssVariables);
    }
    // 修改全局的样式
    private changeCssVariables(cssVariables: Record<string, string>) {
        const root = document.documentElement;
        for (const key in cssVariables) {
            root.style.setProperty(key, cssVariables[key]);
        }
    }
    setCssVariable(key: string, value: string) {
        const root = document.documentElement;
        root.style.setProperty(key, value);
    }
    @watch('cssVariables.*')
    onCssValueChange(operate: any) {
        // console.log(`operate`, operate);
        this.changeCssVariables(this.state.cssVariables);
    }
    @listen('ready')
    onEvent(event: IAppEvent) {
        console.log(`ready event`, JSON.stringify(event));
    }
}
