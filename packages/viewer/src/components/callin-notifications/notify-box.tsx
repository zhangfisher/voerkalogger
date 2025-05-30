/**
 * @author
 * @file notify-box.tsx
 * @fileBase notify-box
 * @path projects\web-client\src\components\callin-notifications\notify-box.tsx
 * @from
 * @desc
 * @example
 */

import React, { useState, useEffect, memo } from 'react';
export interface NotifyBoxProps {
  children?: React.ReactNode;
}
export const NotifyBox: React.FC<NotifyBoxProps> = ({ children }) => {
  return <div className="rounded bg-primary-foreground">{children}</div>;
};

// 默认导出
export default NotifyBox;
