// components/UserTable.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PaginationBar } from '@/components/pagination';

import { updateUser } from '@/api/user';
import { UserEntity } from '@/api/user.types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ClassNameValue } from 'tailwind-merge';
import UserDeleteDialog from './UserDeleteDialog';
import { UserEditDialog } from './UserEditDialog';
interface UserTableProps {
    className?: ClassNameValue;
    users: UserEntity[];
    pagination: {
        currentPage: number;
        pageSize: number;
        total: number;
    };
    onPageChange: (page: number) => void;
    // onPageSizeChange: (size: number) => void;
    onToggleActiveStatus: () => void;
    onDeleteUser: Function;
    onEditUser: Function;
}

export function UserTable({
    className,
    users,
    pagination,
    onPageChange,
    onDeleteUser,
    onEditUser,
    // onPageSizeChange,
    onToggleActiveStatus,
}: UserTableProps) {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    async function handleToggleActive(userId: string, active: boolean) {
        try {
            await updateUser(userId, { disabled: !active });
            toast.success('更新用户状态成功');
            onToggleActiveStatus();
        } catch (e) {
            toast.error('更新用户状态失败');
        }
    }
    return (
        <div className={cn('h-full m-2 border rounded-md', className)}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">头像</TableHead>
                        <TableHead>名称</TableHead>
                        <TableHead>邮箱</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>
                                        {user.title.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{user.title}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                {user.role === 'admin' ? (
                                    <Badge variant="secondary">管理员</Badge>
                                ) : (
                                    <Badge variant="outline">用户</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Switch
                                    // aria-readonly
                                    checked={!user.disabled}
                                    onCheckedChange={(checked) =>
                                        handleToggleActive(user.id, checked)
                                    }
                                />
                            </TableCell>
                            <TableCell className="text-right">
                                <UserEditDialog user={user} onSubmit={onEditUser}></UserEditDialog>
                                <UserDeleteDialog
                                    user={user}
                                    onDelete={onDeleteUser}></UserDeleteDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* 分页控制 */}
            <div className="sticky bottom-0">
                <div className="flex items-center justify-between px-4 py-2 bg-primary-foreground">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground text-nowrap">
                            {pagination.currentPage} / {totalPages} 页
                        </span>
                        {/* <Select
            value={`${pagination.pageSize}`}
            onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  Show {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
                    </div>

                    <PaginationBar
                        pagination={pagination}
                        onPageChange={onPageChange}></PaginationBar>
                </div>
            </div>
        </div>
    );
}
