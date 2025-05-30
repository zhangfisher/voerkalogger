/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\UserOrg\TreeView.tsx
 * @Author: zk.su
 * @Date: 2025-03-25 13:52:43
 * @LastEditTime: 2025-04-18 14:00:33
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
import { TreeNode, TreeNodeComp, DefaultRenderTitle, RenderTitleProps } from './TreeNode';
export type Id = string | number;
export interface TreeViewProps {
    data: TreeNode[];
    level?: number;
    renderNode?: typeof TreeNodeComp;
    renderTitle?: (props: RenderTitleProps) => React.ReactNode;
    expandedKeys?: Id[];
    selectedKeys?: Id[];
    setSelectedKeys?: Function;
    setExpandedKeys?: Function;
}
export const TreeView: React.FC<TreeViewProps> = ({
    data,
    level = 0,
    renderNode = (props: any) => <TreeNodeComp {...props}></TreeNodeComp>,
    renderTitle = DefaultRenderTitle,
    expandedKeys = [],
    selectedKeys = [],
    setSelectedKeys,
    setExpandedKeys,
}) => {
    return (
        <div className="w-full overflow-auto">
            {!data?.length && <div>暂无数据</div>}
            {!!data?.length &&
                data.map((node) => {
                    const hasChildren = !!node?.children?.length && node?.children?.length > 0;
                    const expanded = expandedKeys.includes(node.id);
                    return (
                        <div key={node.id}>
                            {renderNode({
                                node,
                                level,
                                hasChildren,
                                expanded,
                                setExpanded: (value: boolean) => {
                                    if (value) {
                                        if (setExpandedKeys) {
                                            setExpandedKeys?.([
                                                ...new Set([...expandedKeys, node.id]),
                                            ]);
                                        } else {
                                        }
                                    } else {
                                        setExpandedKeys?.(
                                            expandedKeys.filter((key) => key !== node.id),
                                        );
                                    }
                                },
                                renderTitle,
                                selected: selectedKeys.includes(node.id),
                                setSelected: (value: boolean) => {
                                    if (value) {
                                        setSelectedKeys?.([...new Set([...selectedKeys, node.id])]);
                                    } else {
                                        setSelectedKeys?.(
                                            selectedKeys.filter((key) => key !== node.id),
                                        );
                                    }
                                },
                            })}
                            {expanded && hasChildren && (
                                <TreeView
                                    key={node.id}
                                    data={node.children as TreeNode[]}
                                    level={level + 1}
                                    renderNode={renderNode}
                                    renderTitle={renderTitle}
                                    expandedKeys={expandedKeys}
                                    selectedKeys={selectedKeys}
                                    setSelectedKeys={setSelectedKeys}
                                    setExpandedKeys={setExpandedKeys}></TreeView>
                            )}
                        </div>
                    );
                })}
        </div>
    );
};
