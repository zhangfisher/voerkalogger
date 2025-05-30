/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\call\CallTreeNode.tsx
 * @Author: zk.su
 * @Date: 2025-03-26 16:01:13
 * @LastEditTime: 2025-04-18 15:54:36
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DefaultRenderTitle, RenderTitleProps } from '../UserOrg/TreeNode';
import { cn } from '@/lib/utils';
import { type TreeNode } from '../UserOrg/TreeNode';
export function CallTreeNodeComp({
    node,
    level,
    renderTitle = DefaultRenderTitle,
    selected,
    setSelected,
    hasChildren,
    expanded,
    setExpanded,
}: {
    node: TreeNode;
    renderTitle: (props: RenderTitleProps) => React.ReactNode;
    selected: boolean;
    setSelected: (value: boolean) => void;
    level: number;
    hasChildren: boolean;
    expanded: boolean;
    setExpanded: (value: boolean) => void;
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
          select-none
          ${hasChildren ? 'cursor-pointer' : 'cursor-default'}
        `}>
                {renderTitle({ node })}
            </div>
            <div className="absolute right-0 flex flex-row items-center mr-2 space-x-2 -translate-y-1/2 top-1/2">
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
