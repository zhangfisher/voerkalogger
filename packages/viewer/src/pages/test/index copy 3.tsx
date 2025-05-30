/**
 * @author
 * @file index.tsx
 * @fileBase Test
 * @path projects\web-client\src\pages\Test\index.tsx
 * @from
 * @desc
 * @example
 */

import NotifyDemo from "@/components/notify/notify.demo";
import { useState, useEffect, memo } from "react";
export interface TestProps {
  // value: any
}
export const Test: React.FC<TestProps> = () => {
  return (
    <div>
      <NotifyDemo></NotifyDemo>
    </div>
  );
};

// 默认导出
export default Test;
