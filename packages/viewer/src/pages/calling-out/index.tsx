// CallPage.tsx
import { CallModule } from '@/app';
import { LoadingDots } from '@/components/loading-dots';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user.types';
import { useModuleStore } from '@voerka/react';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { formatDateTime } from './time-pass';
import { usePassedTime } from '@/hooks/use-passed-time';
export const CallingOut: React.FC = () => {
  const callModuleStore = useModuleStore<CallModule>('call');
  // @ts-ignore
  const [currentCalling] = callModuleStore.useReactive('currentCalling');
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentCalling) {
      navigate(`/`);
      return;
    }
    currentCalling?.on?.('end', () => {
      navigate(`/`);
    });
  }, [currentCalling]);
  const caller = currentCalling?.config?.user as User;
  const receiver = currentCalling?.config?.peerUser as User;
  // 等待的时长
  // const waitTime = currentCalling?.waitTime;

  // const caller: User = {
  //   name: "刘小凤",
  //   avatar: "/avatar1.jpg",
  // };

  // const receiver: User = {
  //   name: "赵华华",
  //   avatar: "/avatar2.jpg",
  // };
  function hangup() {
    if (currentCalling) {
      currentCalling?.hangup();
    } else {
      logger.debug('非正常挂断, 通话实例未找到');
      navigate(`/`);
    }
  }
  const waitTime = usePassedTime();
  const formattedWaitTime = formatDateTime(waitTime);
  return (
    <div className="h-full min-w-full min-h-full p-6 text-white bg-slate-900">
      {/* 限制最大宽度 */}
      <div className="h-full max-w-lg mx-auto max-h-md">
        {/* 主页*/}
        <main className="flex flex-col h-full justify-evenly">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <Avatar className="mb-2 text-black w-28 h-28">
                <AvatarImage src={caller?.avatar} />
                <AvatarFallback>{caller?.title?.[0]}</AvatarFallback>
              </Avatar>
              <p className="text-sm">{caller?.title}</p>
            </div>

            <div className="flex flex-col items-center justify-center h-full">
              <LoadingDots />
              <p className="mt-2 text-sm text-gray-400">已等待 {formattedWaitTime}</p>
            </div>

            <div className="text-center">
              <Avatar className="mb-2 text-black w-28 h-28">
                <AvatarImage src={receiver?.avatar} />
                <AvatarFallback>{receiver?.title?.[0]}</AvatarFallback>
              </Avatar>
              <p className="text-sm">{receiver?.title}</p>
            </div>
          </div>
          <div className="flex flex-row-reverse w-full">
            <Button variant="destructive" className="px-8 py-2 rounded-full" onClick={hangup}>
              <X></X>
              结束等待
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};
export default CallingOut;
