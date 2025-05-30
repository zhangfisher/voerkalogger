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
import { CallTreeNodeComp } from '../call/CallTreeNode';
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
                id: CALL_CONNECTED_ID.NO_ANSWERED,
                name: '未接听',
                title: '未接听',
            }, //to为当前用户并且未接听
            { id: CALL_CONNECTED_ID.ANSWERED, name: '已接听', title: '已接听' }, //to为当前用户并且已接听
            // {
            //   id: CALL_CONNECTED_ID.OUT_ANSWERED,
            //   name: '呼出已接',
            //   title: '呼出已接',
            // },
            // {
            //   id: CALL_CONNECTED_ID.OUT_NO_ANSWERED,
            //   name: '呼出未接',
            //   title: '呼出未接',
            // },
        ],
    },
];
export const CallStatusSideBar: React.FC<CallStatusSideBarProps> = ({ value, onValueChange }) => {
    const [expandedKeys, setExpandedKeys] = useState<any[]>([]);

    return (
        <div>
            <TreeView
                data={statusTree}
                expandedKeys={expandedKeys}
                setExpandedKeys={setExpandedKeys}
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
