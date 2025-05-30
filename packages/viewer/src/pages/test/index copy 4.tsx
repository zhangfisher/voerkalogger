/**
 * @author
 * @file index.tsx
 * @fileBase Test
 * @path projects\web-client\src\pages\Test\index.tsx
 * @from
 * @desc
 * @example
 */
import { CallModule } from '@/app';
import { useModule, useModuleStore } from '@voerka/react';
import { useState, useEffect, memo } from 'react';
export interface TestProps {
  // value: any
}
export const Test: React.FC<TestProps> = () => {
  const callStore = useModuleStore<CallModule>('call');
  const [currentCalling] = callStore.useReactive('currentCalling');
  const [callings] = callStore.useReactive('callings');
  return (
    <>
      <div>当前的通话: {currentCalling?.state}</div>
      <div>
        {Object.entries(callings).map(([key, value]) => {
          return (
            <div key={key}>
              {key}: {JSON.stringify(value?.state)}
            </div>
          );
        })}
      </div>
    </>
  );
};

// 默认导出
export default Test;
