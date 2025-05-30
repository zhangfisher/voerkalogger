/**
 * @author
 * @file LogList.tsx
 * @fileBase LogList
 * @path projects\web-client\src\pages\log\LogList.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
import LogBar from './LogBar';
import { VoerkaLoggerLevel } from '@voerkalogger/core';
export interface LogListProps {
  data?: any[];
  loading: boolean;
}
export const LogList: React.FC<LogListProps> = ({ data, loading }) => {
  return (
    <div className="h-full overflow-auto">
      {loading && <div>Loading...</div>}
      {!loading && data?.length === 0 && <div>No logs found.</div>}
      {!loading &&
        data?.map?.((log, index) => {
          return <LogBar key={index} log={log}></LogBar>;
        })}
    </div>
  );
};

// 默认导出
export default LogList;
