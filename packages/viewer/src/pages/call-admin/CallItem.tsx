/**
 * @author
 * @file CallItemBar.tsx
 * @fileBase CallItemBar
 * @path projects\web-client\src\pages\contact\CallItemBar.tsx
 * @from
 * @desc
 * @example
 */

import { CallEntity } from '@/api/call.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useModuleStore } from '@voerka/react';
import dayjs from 'dayjs';
import { MoveRight } from 'lucide-react';
import { useMemo } from 'react';

export interface CallItemProps {
  call: CallEntity;
  className?: string;
}

export const CallItem: React.FC<CallItemProps> = ({ call, className = '' }) => {
  const { useReactive } = useModuleStore('user');
  //获取当前登录的用户id

  const colorClass = !call.connected ? 'text-red-500' : 'text-green-500';
  const statedAtView = useMemo(() => {
    // 如果是今年的就不显示今年了
    const d = dayjs(call.startedAt);
    return d.format('YYYY年MM月DD日 HH:mm:ss');
  }, [call.startedAt]);

  return (
      <div
          className={cn(
              'w-full flex gap-2 items-center justify-between p-2 bg-card text-card-foreground rounded-md @container text-xl',
              className,
          )}>
          <div className="flex flex-auto space-x-5 w-14 flex-nowrap">
              <Avatar>
                  <AvatarImage src={call.fromAvatar} />
                  <AvatarFallback>{call.fromTitle.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-nowrap @sm:items-center space-x-5">
                  <h1
                      className={cn('truncate', !call.connected && 'text-red-500')}
                      title={call.fromTitle}>
                      {call.fromTitle}
                  </h1>
                  <h1
                      className={cn('truncate', !call.connected && 'text-red-500')}
                      title={call.from}>
                      {call.from}
                  </h1>
              </div>
          </div>
          <div className="flex w-24 flex-nowrap">
              <MoveRight size={24} className={colorClass} />
          </div>
          <div className="flex flex-auto space-x-5 w-14 flex-nowrap">
              <Avatar>
                  <AvatarImage src={call.toAvatar} />
                  <AvatarFallback>{call.toTitle.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-nowrap @sm:items-center space-x-5">
                  <h1
                      className={cn('truncate', !call.connected && 'text-red-500')}
                      title={call.toTitle}>
                      {call.toTitle}
                  </h1>
                  <h1 className={cn('truncate', !call.connected && 'text-red-500')} title={call.to}>
                      {call.to}
                  </h1>
              </div>
          </div>
          <div className="flex-1 w-32">
              <span className="hidden text-sm whitespace-nowrap @lg:inline">{statedAtView}</span>
          </div>
      </div>
  );
};
