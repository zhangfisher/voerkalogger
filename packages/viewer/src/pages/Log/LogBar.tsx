import { useState } from 'react';
import {
  VoerkaLoggerRecord,
  VoerkaLoggerLevel,
  VoerkaLoggerLevelName,
  VoerkaLoggerLevelNames,
} from '@voerkalogger/core';
import { Badge } from '@/components/ui/badge';

export interface LogBarProps {
  log: VoerkaLoggerRecord;
}

const getLevelColor = (level: VoerkaLoggerLevel) => {
  const colors = {
    [VoerkaLoggerLevel.ERROR]: 'bg-red-100 text-red-800',
    [VoerkaLoggerLevel.FATAL]: 'bg-red-100 text-red-800',
    [VoerkaLoggerLevel.WARN]: 'bg-yellow-100 text-yellow-800',
    [VoerkaLoggerLevel.INFO]: 'bg-blue-100 text-blue-800',
    [VoerkaLoggerLevel.DEBUG]: 'bg-gray-100 text-gray-800',
    [VoerkaLoggerLevel.NOTSET]: 'bg-gray-100 text-gray-800',
  };
  return colors?.[level] || 'bg-gray-100 text-gray-800';
};

const LogBar: React.FC<LogBarProps> = ({ log }) => {
  const levelColor = getLevelColor(log.level);
  const tags = [log.module, ...(log.tags || [])].filter((a) => a);
  return (
    <div className="flex items-center gap-3 p-3 transition-colors bg-white border rounded-lg shadow-sm hover:bg-gray-50">
      {/* 日志等级 */}
      <Badge className={`text-xs font-medium ${levelColor}`}>
        {log.level ? VoerkaLoggerLevelNames[log.level] : 'NOTSET'}
      </Badge>

      {/* 时间戳 */}
      <span className="text-sm text-gray-500">
        {new Date(log.timestamp).toLocaleString()}
      </span>

      {/* 标签 */}
      <div className="flex gap-1">
        {tags &&
          tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
      </div>

      {/* 消息内容 */}
      <span className="flex-1 text-sm text-gray-700">{log.message}</span>
    </div>
  );
};

export default LogBar;
