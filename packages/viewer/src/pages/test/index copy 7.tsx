/**
 * @author
 * @file index.tsx
 * @fileBase test
 * @path projects\web-client\src\pages\test\index.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
import UserList from './UserList';
export interface TestProps {
  // value: any
}
export const Test: React.FC<TestProps> = () => {
  return (
    <div>
      <UserList></UserList>
    </div>
  );
};

// 默认导出
export default Test;
