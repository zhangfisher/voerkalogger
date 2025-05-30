/**
 * @author
 * @file badge.tsx
 * @fileBase badge
 * @path projects\web-client\src\components\app-sidebar\badge.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
export interface WrapBadgeProps {
  children: React.ReactNode;
  badge: React.ReactNode;
}
export const WrapBadge: React.FC<WrapBadgeProps> = ({ children, badge }) => {
  return (
    <div className="relative">
      {children}
      {badge && <div className="absolute top-0 right-0">{badge}</div>}
    </div>
  );
};

// 默认导出
export default WrapBadge;
