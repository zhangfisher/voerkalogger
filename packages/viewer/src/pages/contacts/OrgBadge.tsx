/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\contacts\OrgBadge.tsx
 * @Author: zk.su
 * @Date: 2025-04-21 17:20:37
 * @LastEditTime: 2025-04-21 17:21:48
 * @LastEditors: zk.su
 * @Description: 
 * @TODO: 
 */
/**
 * @author
 * @file OrgBadge.tsx
 * @fileBase OrgBadge
 * @path projects\web-client\src\pages\contacts\OrgBadge.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
export interface OrgBadgeProps {
    values: string[];
}
export const OrgBadge: React.FC<OrgBadgeProps> = (values) => {
    return (
        <Badge>
            {values.map((value) => {
                return (
                    <Badge key={value} variant="outline">
                        {value}
                    </Badge>
                );
            })}{' '}
        </Badge>
    );
};

// 默认导出
export default OrgBadge;
