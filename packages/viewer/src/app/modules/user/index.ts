import { module, Module, watch, listen } from '@voerka/react';
import { CallModule } from '../call';
import { findMyself, findUser } from '@/api/user';
import { type UserEntity } from '@/api/user.types';
import { AuthModule } from '../auth';
import { computed } from '@autostorejs/react';
import { findUnreadCallCount } from '@/api/call-read';
import { state } from '@voerka/react';
interface UserState {
    user?: UserEntity;
    callUnreadCount: 0; // 通话记录未读数量
    // connectUser?: User | null;
    [key: string]: any;
}
@module({ observable: true, id: 'user' })
export class UserModule extends Module {
    state = state<UserState>({
        isAdmin: computed((scope) => {
            return scope?.user?.role === 'admin';
        }),
        userId: computed((scope) => {
            return scope?.user?.id;
        }),
        user: undefined, // {id name avatar }
        connectUser: [],
        callUnreadCount: 0, // 未读数量
    });
    onReady(){
        this.initUser();
    }
    @listen({ event: 'app/ready', async: true })
    async onReadyAsync() {
        console.log(`onReady`);
        try {
            await this.initUser();
        } catch (error) {
            this.logger.error('用户.初始化用户,但失败,原因为{}', error);
        }
    }
    get authModule() {
        return this.app.modules.auth as AuthModule;
    }
    get callModule() {
        // @ts-ignore
        return this.app.modules.call as CallModule;
    }
    async initUser() {
        try {
            const user = await findMyself()
            if (user) {
                this.state.user = user;
                return user;
            } else {
                throw new Error('用户不存在');
            }
        } catch (error) {
            this.logger.error('用户.初始化用户,但失败,原因为{}', error);
            this.authModule.goToLogin();
        }
    }
    async updateLastCallUnreadCount() {
        try {
            const count = await findUnreadCallCount().send(true);
            this.state.callUnreadCount = count || 0;
        } catch (error) {
            console.log('');
        }
    }
    // @ts-ignore
    @watch('user')
    onUserChange() {
        this.callModule.handleUserChange();
    }
}
