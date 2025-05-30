/**
 * @author
 * @file CallItemBar.tsx
 * @fileBase CallItemBar
 * @path projects\web-client\src\pages\contact\CallItemBar.tsx
 * @from
 * @desc
 * @example
 */

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CallEntity } from '@/api/call.types';
import { ArrowDownLeft, ArrowUpRight, Phone } from 'lucide-react';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Status, StatusDot } from '@/components/ui/status-dot';
import { cn } from '@/lib/utils';
import { useCallModule } from '@/app/modules/call/hooks/useCallModule';
import { useModuleStore } from '@voerka/react';
import { UserModule } from '@/app';
import { toast } from 'sonner';
import { findCallRead } from '@/api/call-read';
import { useRequest } from 'ahooks';
import { CallRead } from '@/api/call-read.type';

export interface CallItemProps {
    className?: string;
    call: CallEntity;
    callRead?: CallRead;
}

export const CallItem: React.FC<CallItemProps> = ({ call, className = '', callRead }) => {
    //获取当前登录的用户id
    const { useReactive } = useModuleStore<UserModule>('user');
    const [id] = useReactive('user.id');
    const callingManager = useCallModule();
    const isDirectionOut = call.from === id;
    const callStore = useModuleStore('call');
    const [isOn] = callStore.useReactive('on');
    //from 为当前用户时  呼出
    const otherSide = useMemo(() => {
        if (isDirectionOut) {
            return {
                id: call.to,
                avatar: call.toAvatar,
                title: call.toTitle,
            };
        }
        return {
            id: call.from,
            avatar: call.fromAvatar,
            title: call.fromTitle,
        };
    }, [call.from, call.to, isDirectionOut]);

    async function callOut(id: string) {
        toast.success(`正在呼叫${id}...`);
        await callingManager?.call(id);
    }

    const colorClass = call.connected ? 'text-green-500' : 'text-red-500';

    const textColorClass = call.connected ? 'text-gray-400' : 'text-red-400';

    const statedAtView = useMemo(() => {
        // 如果是今年的就不显示今年了
        const d = dayjs(call.startedAt);
        return d.format('YYYY年MM月DD日 HH:mm:ss');
    }, [call.startedAt]);
    const isUnread = useMemo(() => {
        if (!callRead) return true;
        return new Date(call.startedAt).getTime() >= new Date(callRead?.lastReadAt).getTime();
    }, [call.startedAt, callRead]);
    return (
        <div
            className={cn(
                'flex gap-2 items-center justify-between p-2 bg-card text-card-foreground rounded-md @container text-xl',
                className,
            )}>
            <div className="relative flex-none">
                <Avatar>
                    <AvatarImage src={otherSide.avatar || ''} />
                    <AvatarFallback>{otherSide.title.substring(0, 2)}</AvatarFallback>
                </Avatar>
                {/* 未查看的 */}
                {isUnread && (
                    <StatusDot className="absolute top-0 right-0" status={Status.fail}></StatusDot>
                )}
            </div>
            <div className="flex-auto @sm:items-center">
                <h1
                    className={cn('truncate', !call.connected && 'text-red-500')}
                    title={otherSide.title}>
                    {/* 名称 */}
                    {otherSide.title}
                </h1>
            </div>

            <div className="flex min-w-0 truncate flex-nowrap">
                <div className="content-center">
                    {/* 账号 */}
                    <h1
                        className={cn('text-sm truncate sm:text-base', textColorClass)}
                        title={otherSide.id}>
                        {otherSide.id}
                    </h1>
                </div>
                {/* 呼出 */}
                {isDirectionOut && <ArrowUpRight size={24} className={colorClass} />}
                {/* 呼入 */}
                {!isDirectionOut && <ArrowDownLeft size={24} className={colorClass} />}
            </div>
            <span className="flex-auto inline text-sm min-w-32 whitespace-nowrap">
                {statedAtView}
            </span>
            <div className="">
                <Button
                    disabled={!isOn}
                    variant="ghost"
                    size="lg"
                    onClick={() => callOut(otherSide.id)}>
                    <Phone className="text-green-500" size={24}></Phone>
                </Button>
            </div>
        </div>
    );
};
