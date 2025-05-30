/**
 * @author
 * @file UserOrg.tsx
 * @fileBase UserOrg
 * @path projects\web-client\src\pages\contacts\UserOrg.tsx
 * @from
 * @desc
 * @example
 */
import { findManyDepts } from '@/api/dept';
import { Dept } from '@/api/dept.types';
import SearchInput from '@/components/form/SearchInput';
import { LoadingSpinner } from '@/components/ui/spinner.tsx';
import { useRequest } from 'alova/client';
import { useEffect, useMemo, useState } from 'react';
import DeptAddChildDialog from './DeptAddChildDialog';
import DeptDeleteDialog from './DeptDeleteDialog';
import DeptEditDialog from './DeptEditDialog';
import { TreeNode } from './TreeNode';
import { TreeView } from './TreeView';
import { UserOrgTreeNodeComp } from './UserOrgTreeNode';
import { findExpandedKeysBySearchText } from './utils';
import { addAncestorIds } from '@tikkhun/utils-core';
export interface UserOrgProps {
    selectedId?: number;
    onSelect?: (id: number) => void;
    editable?: boolean;
}
export const UserOrg: React.FC<UserOrgProps> = ({ selectedId, onSelect, editable = false }) => {
    const [filterText, setFilterText] = useState('');
    const { loading, data, send } = useRequest(findManyDepts, {
        immediate: true,
        force: (event) => {
            return event.args[0];
        },
    });
    const [addChildDialogOpen, setAddChildDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState<Dept | undefined>(undefined);
    async function handleEdit(node: TreeNode) {
        setSelectedNode(node);
        setEditDialogOpen(true);
    }
    async function handleDelete(node: TreeNode) {
        setSelectedNode(node);
        setDeleteDialogOpen(true);
    }
    async function handleAddChild(node: TreeNode) {
        setSelectedNode(node);
        setAddChildDialogOpen(true);
    }
    function handleTreeAction(action: string, node: TreeNode) {
        switch (action) {
            case 'edit':
                handleEdit(node);
                break;
            case 'delete':
                handleDelete(node);
                break;
            case 'addChild':
                handleAddChild(node);
                break;
        }
    }
    // const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
    const treeData = useMemo(() => {
        const _data = addAncestorIds(data);
        return [_data];
    }, [data]);
    const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
    useEffect(() => {
        if (expandedKeys.length) return;
        if (data) {
            setExpandedKeys([data.id]);
        }
    }, [data, expandedKeys]);
    // useEffect(() => {
    //     if (selectedNode) return;
    //     if (data) {
    //         setSelectedNode(data);
    //     }
    // }, [data]);
    // const dataMap = useMemo(() => {

    // }, [data]);
    const onFilterTextChange = (value: string) => {
        setFilterText(value);
        const shouldExpandedKeys: number[] = findExpandedKeysBySearchText<number>(treeData, value);
        setExpandedKeys(shouldExpandedKeys);
    };

    return (
        <div className="flex flex-col items-center gap-2 py-2">
            <div className="flex flex-row items-center gap-2 px-2">
                <SearchInput
                    placeholder="搜索分组..."
                    value={filterText}
                    onChange={onFilterTextChange}
                    search={() => send(true)}></SearchInput>
                {/* 刷新 */}
                {/* <Button variant="ghost" onClick={() => send(true)}>
          <RotateCw></RotateCw>
        </Button> */}
            </div>
            {loading && <LoadingSpinner></LoadingSpinner>}
            {/* <Tree> */}
            {!loading && !data && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <div>暂无数据</div>
                </div>
            )}
            {!loading && !!data && (
                <TreeView
                    data={treeData as TreeNode[]}
                    expandedKeys={expandedKeys}
                    setExpandedKeys={setExpandedKeys}
                    renderNode={(props) => (
                        <UserOrgTreeNodeComp
                            {...props}
                            searchText={filterText}
                            editable={editable}
                            onAction={handleTreeAction}
                            selected={selectedId === props.node?.id}
                            setSelected={(value: boolean) => {
                                onSelect(value ? props.node?.id : undefined);
                            }}></UserOrgTreeNodeComp>
                    )}></TreeView>
            )}
            <DeptEditDialog
                node={selectedNode}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSubmit={() => send(true)}></DeptEditDialog>
            <DeptAddChildDialog
                node={selectedNode}
                open={addChildDialogOpen}
                onOpenChange={setAddChildDialogOpen}
                onSubmit={() => send(true)}></DeptAddChildDialog>
            <DeptDeleteDialog
                node={selectedNode}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onSubmit={() => send(true)}></DeptDeleteDialog>
        </div>
    );
};

// 默认导出
export default UserOrg;
