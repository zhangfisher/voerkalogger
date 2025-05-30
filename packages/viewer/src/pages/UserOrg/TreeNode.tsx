/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\UserOrg\TreeNode.tsx
 * @Author: zk.su
 * @Date: 2025-03-25 13:57:16
 * @LastEditTime: 2025-04-18 11:51:27
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
import { useState, useEffect, memo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TreeNode {
    id: string | number;
    title?: string;
    icon?: React.ReactNode;
    children?: TreeNode[];
    [prop: string]: any;
}
export const DefaultRenderTitle = ({ node }: { node: TreeNode }) => {
    return node.title || '-';
};
export const RenderTitleBySearchText = ({
    node,
    searchText,
}: {
    node: TreeNode;
    searchText: string;
}) => {
    if (!searchText) {
        return node.title || '-';
    }
};
export interface RenderTitleProps {
    node: TreeNode;
    [prop: string]: any;
}
export function TreeNodeComp({
    node,
    level,
    hasChildren,
    renderTitle = DefaultRenderTitle,
    expanded = false,
    setExpanded,
    selected = false,
    setSelected,
}: {
    node: TreeNode;
    level: number;
    hasChildren: boolean;
    expanded: boolean;
    setExpanded: Function;
    renderTitle: (props: RenderTitleProps) => React.ReactNode;
    // 选择很常见
    selected: boolean;
    setSelected: (value: boolean) => void;
}) {
    return (
        <div style={{ paddingLeft: `${level * 20}px` }}>
            <div
                className={cn(
                    `
          flex items-center py-2 justify-start
          ${hasChildren ? 'cursor-pointer' : 'cursor-default'}
          select-none
        `,
                    { 'rounded hover:bg-primary hover:text-white': selected },
                )}
                onClick={() => (hasChildren ? setExpanded(!expanded) : setSelected(!selected))}>
                {hasChildren && (
                    <span className="mr-2">
                        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                )}
                {renderTitle({ node })}
            </div>
        </div>
    );
}
