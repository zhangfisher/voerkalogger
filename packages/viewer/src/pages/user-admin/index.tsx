/**
 * @author
 * @file index.tsx
 * @fileBase user-admin
 * @path projects\web-client\src\pages\user-admin\index.tsx
 * @from
 * @desc
 * @example
 */

import { findManyUser } from '@/api/user';
import { cn } from '@/lib/utils';
import { usePagination } from 'alova/client';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UserOrg } from '../UserOrg/UserOrg';
import { UserAddDialog } from './UserAddDialog';
import { UserSearchBar } from './UserSearchBar';
import { UserTable } from './UserTable';
import { NotData } from '@/components/NotData';
export interface UsersAdminProps {
    // value: any
}
export const UsersAdmin: React.FC<UsersAdminProps> = () => {
    // searchBarState
    const [selectedDeptId, setSelectedDeptId] = useState(0);
    const [filterText, setFilterText] = useState('');
    const [isTitleAsc, setIsTitleAsc] = useState(true);
    // getUsers
    const {
        error,
        loading,
        data: users,
        isLastPage,
        page,
        pageSize,
        total,
        refresh,
        update,
    } = usePagination(
        (page, pageSize) => {
            return findManyUser({
                page,
                pageSize,
                deptId: selectedDeptId,
                filterText: filterText,
                orderByTitle: isTitleAsc,
            });
        },
        {
            debounce: 200,
            immediate: true,
            watchingStates: [selectedDeptId, filterText, isTitleAsc],
            initialData: {
                data: [],
                pagination: {
                    pageSize: 20,
                    current: 1,
                    total: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                },
            },
            initialPage: 1,
            initialPageSize: 10,
            total: (response: any) => response.pagination.total,
            data: (response: any) => response.data,
        },
    );
    function refreshUsers() {
        refresh();
        toast.success('刷新用户列表完毕');
    }
    return (
        <div className="flex h-full @container">
            <aside className="flex-none w-64 overflow-auto bg-secondary">
                <UserOrg
                    selectedId={selectedDeptId}
                    onSelect={setSelectedDeptId}
                    editable></UserOrg>
            </aside>
            <main className="flex flex-col w-full h-full overflow-auto bg-primary-foreground">
                <div className="flex flex-wrap items-center">
                    <UserSearchBar
                        className="flex-1"
                        filterText={filterText}
                        onFilterTextChange={setFilterText}
                        isTitleAsc={isTitleAsc}
                        onIsTitleAscChange={setIsTitleAsc}></UserSearchBar>
                    {/* add */}
                    <UserAddDialog onSubmit={refreshUsers}></UserAddDialog>
                    {/* 刷新 */}
                    <Button
                        className={cn('bg-white hover:bg-gray-50 text-primary')}
                        onClick={refreshUsers}>
                        <RotateCw />
                    </Button>
                </div>
                {error && <div className="flex justify-center">数据获取错误</div>}
                {!error && !users?.length && <NotData className="flex-1"></NotData>}
                {!error && users?.length && (
                    <UserTable
                        className="flex-1 overflow-auto bg-white"
                        users={users}
                        pagination={{
                            currentPage: page,
                            pageSize,
                            total: total ?? 0,
                        }}
                        onPageChange={(page) => update({ page })}
                        onToggleActiveStatus={refreshUsers}
                        onDeleteUser={refreshUsers}
                        onEditUser={refreshUsers}></UserTable>
                )}
            </main>
        </div>
    );
};

// 默认导出
export default UsersAdmin;
