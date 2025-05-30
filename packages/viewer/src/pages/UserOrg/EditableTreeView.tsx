/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\UserOrg\EditableTreeView.tsx
 * @Author: zk.su
 * @Date: 2025-03-25 13:52:43
 * @LastEditTime: 2025-04-17 16:41:15
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file TreeView.tsx
 * @fileBase TreeView
 * @path projects\web-client\src\pages\contacts\TreeView.tsx
 * @from
 * @desc
 * @example
 */
import { cn } from '@/lib/utils';
import { ActionGroups, type Action } from './ActionGroups';
import { RenderTitleProps, type TreeNode } from './TreeNode';
import { TreeView, type TreeViewProps } from './TreeView';
import { defaultTreeNodeActions } from './tree-node-actions';
export interface EditableTreeViewProps extends TreeViewProps {
    actions: Action[];
    onAction: (type: string, node: TreeNode) => void;
    selectedKeys: any[];
    setSelectedKeys: (keys: any[]) => void;
}
export const EditableTreeView: React.FC<EditableTreeViewProps> = ({
    actions = defaultTreeNodeActions,
    selectedKeys = [],
    setSelectedKeys,
    onAction,
    ...props
}) => {
    function isSelected(node: TreeNode) {
        return selectedKeys.includes(node.id);
    }
    const renderTitle = ({ node }: RenderTitleProps) => {
        return (
            <div
                className={cn('flex flex-row relative truncate min-w-0 w-full', {
                    'bg-primary rounded': isSelected(node),
                })}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedKeys([node.id]);
                    onAction('click', node);
                }}>
                {node.title}
                <ActionGroups
                    actions={actions}
                    onAction={(type) => onAction(type, node)}></ActionGroups>
            </div>
        );
    };
    return (
        <TreeView
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            {...props}
            renderTitle={renderTitle}></TreeView>
    );
};

// 默认导出
export default EditableTreeView;
