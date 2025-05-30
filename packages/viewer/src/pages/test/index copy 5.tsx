/**
 * @author
 * @file index.tsx
 * @fileBase Test
 * @path projects\web-client\src\pages\Test\index.tsx
 * @from
 * @desc
 * @example
 */
import { TestModule } from '@/app';
import { useModule, useModuleStore } from '@voerka/react';
import { useState, useEffect, memo } from 'react';
export interface TestProps {
  // value: any
}
export const Test: React.FC<TestProps> = () => {
  const testStore = useModuleStore<TestModule>('test');
  const [a, setA] = testStore.useReactive('obj.a');
  const [nestedPlainObjectA, setNestedPlainObjectA] = testStore.useReactive('obj.nested.a');
  const [nestedObjA, setNestedObjA] = testStore.useReactive('obj.nestedObj.a');

  return (
    <>
      <div>当前: {a}</div>
      <button onClick={() => setA(Math.random())}>点击</button>
      <div>{nestedPlainObjectA}</div>
      <button onClick={() => setNestedPlainObjectA(Math.random())}>点击</button>
      <div>{nestedObjA}</div>
      <button onClick={() => setNestedObjA(Math.random())}>点击</button>
    </>
  );
};

// 默认导出
export default Test;
