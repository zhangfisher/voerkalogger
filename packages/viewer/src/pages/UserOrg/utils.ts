/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\UserOrg\utils.ts
 * @Author: zk.su
 * @Date: 2025-04-17 15:12:30
 * @LastEditTime: 2025-04-18 15:24:18
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
import { TreeNode } from './TreeNode';
// 展开树节点
export const findExpandedKeysBySearchText = <Id = string | number>(
    treeData: any[] = [],
    searchText: string = '',
) => {
    if (!searchText) return [];
    let expandedKeys: Id[] = [];
    // 遍历取值
    const traverseTree = (nodes: TreeNode[]) => {
        for (const node of nodes) {
            if (node?.title?.includes(searchText) && node?.ancestorIds?.length) {
                expandedKeys = [...expandedKeys,...node?.ancestorIds]
            }
            if (node.children) {
                traverseTree(node.children);
            }
        }
    };

    traverseTree(treeData);
    const result = [...new Set(expandedKeys)];
    return result;
};
