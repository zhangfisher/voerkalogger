/**
 * @author
 * @file index.tsx
 * @fileBase test
 * @path projects\web-client\src\pages\test\index.tsx
 * @from
 * @desc
 * @example
 */

import { TreeSelect } from "@/components/TreeSelect";
import { useState, useEffect, memo } from "react";
import { SelectForm } from "./from";
import LogManager from "./log";
interface Props {
  // value: propTypes.any
}
export const Test: React.FC<Props> = () => {
  const [value, setValue] = useState("");
  // console.log(`voerkaPhone`, voerkaPhone);
  return (
    <div className="w-full h-full bg-white">
      {/* <SelectForm></SelectForm> */}
      <LogManager></LogManager>
      {/* <TreeSelect value={value} data={{
        id: '1',
        name: '一级',
        children: [{
          id:'2',
          name: '二级'
        }]
      }} onChange={setValue}/> */}
    </div>
  );
};
