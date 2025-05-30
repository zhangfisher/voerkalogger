/**
 * @author
 * @file WaitTime.tsx
 * @fileBase WaitTime
 * @path projects\web-client\src\pages\calling-out\WaitTime.tsx
 * @from
 * @desc
 * @example
 */

import dayjs from 'dayjs';
export function formatDateTime(waitTime: number) {
  const formattedWaitTime = dayjs(waitTime * 1000).format('mm:ss');
  return formattedWaitTime;
}
