/**
 * @author
 * @file app.tsx
 * @fileBase app
 * @path packages\calling-client-sdk\lib\app\app.tsx
 * @from
 * @desc
 * @example
 */

import CallInNotifications from '@/components/callin-notifications';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import { useApp, useModuleStore } from '@voerka/react';
import { RouterProvider } from 'react-router';
import { VoerkaPhone } from '../voerka-phone';
import { Portal } from './Portal';
import { useRef } from 'react';
export interface AppDialogProps {
  children: React.ReactNode;
}
// Root
export const AppDialog: React.FC<AppDialogProps> = ({ children }) => {
  const app = useApp();
  const appStore = useModuleStore('app');
  const [appTitle] = appStore.useReactive('title');
  const [isPlugin] = appStore.useReactive('plugin');
  const dialogContainer = useRef(null);
  // const [appName] = useReactive<string>("app.name");
  return (
    <div className="voerka-calling">
      <div ref={dialogContainer} id="dialog-container"></div>
      <Dialog>
        <DialogTrigger asChild>
          <div>{children}</div>
        </DialogTrigger>
        <DialogContent
          portalContainer={dialogContainer.current}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          className="overflow-hidden">
          <DialogHeader>
            <DialogTitle>{appTitle}</DialogTitle>
          </DialogHeader>
          <main className="max-h-[50rem] max-w-full w-full h-full min-h-[48rem] min-w-[70rem]">
            {/* 内容区 */}
            <RouterProvider router={(app as VoerkaPhone).router}></RouterProvider>
          </main>
        </DialogContent>
      </Dialog>
      <Toaster position="top-center" expand={true}></Toaster>
      <Portal>
        <CallInNotifications></CallInNotifications>
      </Portal>
    </div>
  );
};
