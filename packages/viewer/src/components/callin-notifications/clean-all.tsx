/**
 * @author
 * @file clean-all.tsx
 * @fileBase clean-all
 * @path projects\web-client\src\components\callin-notifications\clean-all.tsx
 * @from
 * @desc
 * @example
 */

import { useModule } from '@voerka/react';
import { X } from 'lucide-react';
import { useState, useEffect, memo } from 'react';
import { Button } from '../ui/button';
import { CallModule } from '@/app';
export interface CleanAllProps {
  // value: any
}
export const CleanAll: React.FC<CleanAllProps> = () => {
  const callModule = useModule<CallModule>('call');
  function closeAllCallIns() {
    callModule?.closeAllCallIns();
  }
  return (
    <Button className="w-full" onClick={closeAllCallIns}>
      <X /> 清空全部
    </Button>
  );
};

// 默认导出
export default CleanAll;
