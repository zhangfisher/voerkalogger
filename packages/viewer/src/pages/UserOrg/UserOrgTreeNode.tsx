/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\UserOrg\UserOrgTreeNode.tsx
 * @Author: zk.su
 * @Date: 2025-03-26 16:01:13
 * @LastEditTime: 2025-04-18 13:57:15
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DefaultRenderTitle } from './TreeNode';
import { cn } from '@/lib/utils';
import { type TreeNode } from './TreeNode';
import { defaultTreeNodeActions } from './tree-node-actions';
import { ActionGroups, type Action } from './ActionGroups';
import HighlightTitle from './HighlightTitle';
export function UserOrgTreeNodeComp({
    selected,
    setSelected,
    node,
    level,
    hasChildren,
    expanded,
    setExpanded,
    onAction,
    actions = defaultTreeNodeActions,
    editable = true,
    searchText,
}: {
    node: TreeNode;
    level: number;
    hasChildren: boolean;
    selected: boolean;
    setSelected: (value: boolean) => void;
    expanded: boolean;
    setExpanded: Function;
    editable?: boolean;
    actions?: Action[];
    onAction: Function;
    searchText: string;
}) {
    return (
        <div
            className={cn('relative px-2 py-4 group', { 'bg-primary text-white ': selected })}
            style={{ paddingLeft: `${level * 20}px` }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelected(!selected);
            }}>
            <div
                className={`
          px-2
          truncate min-w-0
          flex items-center justify-start
          ${hasChildren ? 'cursor-pointer' : 'cursor-default'}
          select-none
        `}>
                <HighlightTitle value={node?.title} highlightText={searchText}></HighlightTitle>
            </div>
            <div className="absolute right-0 flex flex-row items-center mr-2 space-x-2 -translate-y-1/2 top-1/2">
                {editable && actions && actions.length > 0 && (
                    <ActionGroups
                        className="hidden group-hover:flex "
                        actions={defaultTreeNodeActions}
                        onAction={(type) => {
                            onAction(type, node);
                        }}></ActionGroups>
                )}
                {hasChildren && (
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            hasChildren && setExpanded(!expanded);
                        }}>
                        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                )}
            </div>
        </div>
    );
}
