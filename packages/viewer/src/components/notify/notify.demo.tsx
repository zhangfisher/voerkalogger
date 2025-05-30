/**
 * @author
 * @file notify.demo.tsx
 * @fileBase notify.demo
 * @path projects\web-client\src\components\notify\notify.demo.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from "react";
import { NotifyContainer, useNotify } from ".";
export interface NotifyDemoProps {
  // value: any
}
const UseNotifyDemo = () => {
  const notify = useNotify();
  useEffect(() => {
    notify(<div>123</div>);
  }, []);
  return <div>use</div>;
};
export const NotifyDemo: React.FC<NotifyDemoProps> = () => {
  return (
    <div>
      <NotifyContainer>
        <UseNotifyDemo></UseNotifyDemo>
      </NotifyContainer>
    </div>
  );
};

// 默认导出
export default NotifyDemo;
