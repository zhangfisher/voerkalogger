/**
 * @author
 * @file App.tsx
 * @fileBase App
 * @path projects\web-cliet\src\App.tsx
 * @from
 * @desc
 * @example
 */

import { Toaster } from '@/components/ui/sonner';
import { RouterProvider } from 'react-router';
import { useApp } from '@voerka/react';
import { CallInNotifications } from '@/components/callin-notifications';

export const App: React.FC = () => {
  const app = useApp();
  return (
    <div className="w-screen h-screen">
      {/* <ThemeProvider storageKey="vite-ui-theme"> */}
      {/* 内容区 */}
      <RouterProvider router={app.router}></RouterProvider>
      <Toaster position="top-center" expand={true}></Toaster>
      <CallInNotifications></CallInNotifications>
      {/* </ThemeProvider> */}
    </div>
  );
};

export default App;
