/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\test\index.tsx
 * @Author: zk.su
 * @Date: 2025-02-25 15:18:14
 * @LastEditTime: 2025-03-25 15:29:40
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file index.tsx
 * @fileBase test
 * @path projects\web-client\src\pages\test\index.tsx
 * @from
 * @desc
 * @example
 */

import { LoadingDots } from '@/components/loading-dots';
import { useState, useEffect, memo } from 'react';
export interface TestProps {
    // value: any
}
export const Test: React.FC<TestProps> = () => {
    return (
        <div className="flex flex-col h-screen bg-black">
            <div className="bg-green-900">123</div>
            <div className="!flex-1 bg-primary">123</div> <div className="bg-green-500">底部</div>
        </div>
    );
};

// 默认导出
export default Test;
