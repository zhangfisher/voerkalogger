/**
 * @author
 * @file index.tsx
 * @fileBase test
 * @path projects\web-client\src\pages\test\index.tsx
 * @from
 * @desc
 * @example
 */

import TreeDemo from "@/components/tree/tree.demo";
export interface TestProps {
  // value: any
}
export const Test: React.FC<TestProps> = () => {
  return (
    <div>
      <TreeDemo></TreeDemo>
    </div>
  );
};
