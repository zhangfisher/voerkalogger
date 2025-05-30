/**
 * @author
 * @file call-status-corner-badge.tsx
 * @fileBase call-status-corner-badge
 * @path projects\web-client\src\components\app-sidebar\call-status-corner-badge.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
import { Status, StatusDot } from '../ui/status-dot';
import { useModule, useModuleStore } from '@voerka/react';
import { CallModule } from '@/app/modules/call';
export interface CallStatusCornerBadgeProps {
  children: React.ReactNode;
}
export const CallStatusCornerBadge: React.FC<CallStatusCornerBadgeProps> = ({ children }) => {
  const callModuleStore = useModuleStore<CallModule>('call');
  const [isOn] = callModuleStore.useReactive('on');
  return (
    <div className="relative">
      {children}
      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
        <StatusDot
          className="absolute top-0 right-0"
          size={3}
          status={isOn ? Status.success : Status.fail}></StatusDot>
      </div>
    </div>
  );
};

// 默认导出
export default CallStatusCornerBadge;
