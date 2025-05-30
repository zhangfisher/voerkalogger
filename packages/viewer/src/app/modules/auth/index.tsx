import { module, Module, state, configurable } from '@voerka/react';
import { UserModule } from '../user';
import { signIn, SignInOptions, signOut } from '@/api/auth';
import { findMyself } from '@/api/user';
import { setToken, getToken } from '@/utils/token';
@module({ observable: true, id: 'auth' })
export class AuthModule extends Module {
    state = state({
        // token: undefined,
        autoLogin: configurable(true), // 是否自动登录 如果自动登录的的话直接获取用户
        isLogin: false,
    });
    get userModule() {
        return this.app.modules.user as UserModule;
    }
    setToken(token: string) {
        setToken(token);
    }
    getToken() {
        return getToken();
    }
    removeToken() {
        setToken('');
    }
    async login(options: SignInOptions) {
        const { token } = await signIn(options);
        setToken(token);
        return token;
    }
    async loginAndGetUser(options: SignInOptions) {
        try {
            const token = await this.login(options);
            setToken(token);
            const result = await findMyself();
            if (!result) {
                throw new Error('用户不存在');
            }
            this.userModule.state.user = result;
            this.state.isLogin = true;
            return result;
        } catch (error) {
            this.state.isLogin = false;
            this.userModule.state.user = undefined;
            throw error;
        }
    }
    async logout() {
        try {
            this.logger.debug('[开始] 退出登录');
            this.state.isLogin = false;
            this.userModule.state.user = null;
            console.log(`this.userModule.state`, this.userModule.state);
            await signOut(); // 由于基于的是session 所以需要调用登出接口
            this.removeToken();
            this.goToLogin();
        } catch (error) {
            console.log;
        }
    }
    goToLogin(redirectPath?: string) {
        // console.log(`goToLogin`, this.app.router);
        if (this.app.router.pathname === '/login') {
            return;
        }
        this.app.router.navigate('/login', {
            params: {
                redirect: redirectPath || this.app.router.pathname,
            },
        });
    }
}
