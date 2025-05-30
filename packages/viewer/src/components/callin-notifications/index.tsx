/**
 * @author
 * @file index.tsx
 * @fileBase callin-notifications
 * @path projects\web-cliet\src\components\callin-notifications\index.tsx
 * @from
 * @desc
 * @example
 */

import { cn } from '@/app';
import { Calling, CallingState } from '@/app/modules/call/Calling';
import usePanelPosition from '@/hooks/usePanelPosition';
import { useModuleStore } from '@voerka/react';
import { Phone, PhoneOff } from 'lucide-react';
import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import CleanAll from './clean-all';

import { ClassNameValue } from 'tailwind-merge';
export interface CallInViewProps {
    calling: Calling;
}
export const CallInView: React.FC<CallInViewProps> = ({ calling }) => {
    function hangup(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        e.stopPropagation();
        calling.hangup();
    }
    function answer(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        e.stopPropagation();
        calling.answer();
    }
    return (
        <div>
            {/* <h1 className="font-bold truncate">新呼入</h1> */}
            <div className="flex flex-row items-center justify-between">
                <div className="flex gap-2">
                    <Avatar>
                        {/* 用户 */}
                        <AvatarImage src={calling.config.peerUser.avatar} />
                        <AvatarFallback>
                            {('' + calling.config.peerUser.title).substring(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-evenly">
                        <span className="truncate">{calling.config.peerUser.title}</span>
                        <span className="text-sm truncate text-secondary-foreground">
                            {calling.config.peerUser.id}
                        </span>
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <Button
                        title="挂断"
                        className="w-10 h-10 bg-red-500 rounded-full hover:bg-red-400"
                        onClick={(e) => hangup(e)}>
                        <PhoneOff></PhoneOff>
                    </Button>
                    <Button
                        title="接听"
                        className="w-10 h-10 bg-green-500 rounded-full hover:bg-green-400"
                        onClick={(e) => answer(e)}>
                        <Phone></Phone>
                    </Button>
                </div>
            </div>
        </div>
    );
};

// 默认导出
export interface CallInNotificationsProps {
    // value: any
    className?: ClassNameValue;
}

export const CallInNotifications: React.FC<CallInNotificationsProps> = ({ className }) => {
    const callStore = useModuleStore('call');
    // @ts-ignore
    const [callings] = callStore.useReactive('callings');
    const callIns = useMemo(() => {
        return Object.entries(callings as Calling[]).filter(([peerId, calling]) => {
            return (
                calling.config.direction === 'in' &&
                [CallingState.init, CallingState.connecting].includes(calling.state)
            );
        });
    }, [callings]);
    const [notifyPosition] = callStore.useReactive('notify.position');
    const positionClassName = usePanelPosition(notifyPosition);
    return (
        <div
            className={cn(
                'fixed z-[60] flex flex-col gap-2  w-72 pointer-events-auto',
                positionClassName,
                className,
            )}>
            <div className="flex flex-col gap-2 overflow-auto max-h-60">
                {/*  */}
                {callIns.map(([peerId, calling]) => {
                    {
                        return (
                            <div
                                className="p-2 bg-white border rounded-md shadow-md dark:bg-black"
                                key={peerId}>
                                <CallInView calling={calling}></CallInView>
                            </div>
                        );
                    }
                })}
            </div>
            {!!callIns?.length && <CleanAll></CleanAll>}
        </div>
    );
};

// 默认导出
export default CallInNotifications;
