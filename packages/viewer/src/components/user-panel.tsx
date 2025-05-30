/*
 * @FilePath: \voerka-phone\projects\web-client\src\components\user-panel.tsx
 * @Author: zk.su
 * @Date: 2024-12-30 10:25:59
 * @LastEditTime: 2025-03-21 14:03:12
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file user-panel.tsx
 * @fileBase user-panel
 * @path projects\web-client\src\components\user-panel.tsx
 * @from
 * @desc
 * @example
 */

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { useModule, useModuleStore } from '@voerka/react';
import { AuthModule, CallModule, UserModule } from '@/app/modules';
import { Badge } from '@/components/ui/badge';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UserPanelProps {
    // value: any
}
export const UserPanel: React.FC<UserPanelProps> = () => {
    const { useReactive } = useModuleStore<UserModule>('user');
    const [id] = useReactive<string>('user.id');
    const [username] = useReactive<string>('user.title');
    const [avatar] = useReactive('user.avatar');
    const authModule = useModule<AuthModule>('auth');
    const callModuleStore = useModuleStore<CallModule>('call');
    const [isOn] = callModuleStore.useReactive('on');
    const callModule = useModule<CallModule>('call');
    function logout() {
        authModule.logout();
    }
    function handleClick() {
        if (isOn) return;
        callModule.initPeer();
    }
    return (
        <div className="flex flex-col w-64 gap-2">
            <div className="flex flex-row items-center gap-2">
                <Avatar className="size-16">
                    {/* 用户 */}
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{('' + (username || id)).substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h1 className="font-bold">{username || id}</h1>
                        <Badge
                            onClick={handleClick}
                            className={cn(
                                '',
                                { 'bg-green-500 hover:bg-green-500/80': isOn },
                                { 'bg-red-500 hover:bg-red-500/80': !isOn },
                            )}>
                            {isOn ? '通话连接' : '通话未连接'}
                        </Badge>
                        {/* <StatusDot status={isOn ? Status.success : Status.fail}></StatusDot> */}
                    </div>
                    <span className="text-sm text-secondary-foreground">{id}</span>
                </div>
            </div>
            <Separator></Separator>
            <DropdownMenuItem onClick={logout}>
                <LogOut />
                退出登录
            </DropdownMenuItem>
        </div>
    );
};
