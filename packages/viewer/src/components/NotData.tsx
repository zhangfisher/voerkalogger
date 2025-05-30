/**
 * @author
 * @file NotData.tsx
 * @fileBase NotData
 * @path projects\web-client\src\components\NotData.tsx
 * @from
 * @desc
 * @example
 */

import { cn } from '@/lib/utils';
import { useState, useEffect, memo } from 'react';
export interface NotDataProps {
    className?: string;
    children?: React.ReactNode;
}
import NotDataImg from '@/assets/images/NoData.small.png';
export const NotData: React.FC<NotDataProps> = ({ className, children }) => {
    return (
        <div className={cn('flex flex-col justify-center items-center', className)}>
            <img src={NotDataImg} width="200" height="200" />
            <p className="text-sm text-center text-gray-500">{children || '暂无数据'}</p>
        </div>
    );
};

// 默认导出
export default NotData;
