/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\call\CallStatusSideBar.tsx
 * @Author: zk.su
 * @Date: 2025-04-02 10:48:19
 * @LastEditTime: 2025-04-18 10:58:30
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file CallStatusSideBar.tsx
 * @fileBase CallStatusSideBar
 * @path projects\web-client\src\pages\call\CallStatusSideBar.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
import { TreeView } from '../UserOrg/TreeView';
import { CallTreeNodeComp } from './CallTreeNode';
export interface CallStatusSideBarProps {
    value: any;
    onValueChange: (value: any) => void;
}
export const CALL_CONNECTED_ID = {
    FAILED: -1,
    ALL: 1,
    ANSWERED: 2,
    NO_ANSWERED: 3,
    IN_ANSWERED: 4,
    IN_NO_ANSWERED: 5,
    OUT_ANSWERED: 6,
    OUT_NO_ANSWERED: 7,
};
export const statusTree = [
    {
        id: CALL_CONNECTED_ID.ALL,
        name: '全部',
        title: '全部',
        children: [
            {
                id: CALL_CONNECTED_ID.IN_NO_ANSWERED,
                name: '呼入未接',
                title: '呼入未接',
            }, //to为当前用户并且未接听
            {
                id: CALL_CONNECTED_ID.IN_ANSWERED,
                name: '呼入已接',
                title: '呼入已接',
            }, //to为当前用户并且已接听
            {
                id: CALL_CONNECTED_ID.OUT_ANSWERED,
                name: '呼出已接',
                title: '呼出已接',
            },
            {
                id: CALL_CONNECTED_ID.OUT_NO_ANSWERED,
                name: '呼出未接',
                title: '呼出未接',
            },
        ],
    },
];
export const CallStatusSideBar: React.FC<CallStatusSideBarProps> = ({ value, onValueChange }) => {
    const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
    return (
        <div>
            <TreeView
                data={statusTree}
                expandedKeys={expandedKeys}
                setExpandedKeys={setExpandedKeys}
                selectedKeys={selectedKeys}
                setSelectedKeys={setSelectedKeys}
                renderNode={(props) => (
                    <CallTreeNodeComp
                        {...props}
                        selected={value === props.node?.id}
                        setSelected={(selected: boolean) => {
                            onValueChange(selected ? props.node?.id : undefined);
                        }}></CallTreeNodeComp>
                )}></TreeView>
        </div>
    );
};

// 默认导出
export default CallStatusSideBar;
