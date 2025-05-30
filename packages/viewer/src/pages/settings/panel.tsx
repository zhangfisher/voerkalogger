/**
 * @author
 * @file panel.tsx
 * @fileBase panel
 * @path projects\web-client\src\pages\settings\panel.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo, ReactNode } from 'react';
export interface PanelProps {
  children: ReactNode;
}
export const Panel: React.FC<PanelProps> = ({ children }) => {
  return <div className="p-6 rounded-lg shadow">{children}</div>;
};

// 默认导出
export default Panel;
