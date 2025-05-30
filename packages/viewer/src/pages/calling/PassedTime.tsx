/**
 * @author
 * @file TimePass.tsx
 * @fileBase TimePass
 * @path projects\web-client\src\pages\calling\TimePass.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
import { usePassedTime } from '@/hooks/use-passed-time';
import { formatDateTime } from '../calling-out/time-pass';
export interface TimePassProps {
  // value: any
}
export const PassedTime: React.FC<TimePassProps> = () => {
  const passedTime = usePassedTime();
  const formattedWaitTime = formatDateTime(passedTime);
  return <span>{formattedWaitTime}</span>;
};

// 默认导出
export default PassedTime;
