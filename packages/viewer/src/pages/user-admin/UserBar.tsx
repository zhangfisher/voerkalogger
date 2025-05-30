/**
 * @author
 * @file UserItem.tsx
 * @fileBase UserItem
 * @path projects\web-client\src\pages\user\UserItem.tsx
 * @from
 * @desc
 * @example
 */

import { UserEntity } from '@/api/user.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import UserDeleteDialog from './UserDeleteDialog';
import { UserEditDialog } from './UserEditDialog';
export interface UserItemProps {
  user: UserEntity;
  handleEdit: Function;
  handleDelete: Function;
  className?: string;
}
export const UserBar: React.FC<UserItemProps> = ({ user, handleEdit, handleDelete, className }) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-between p-2 space-x-2 rounded-md bg-card text-card-foreground @container text-xl',
        className,
      )}>
      {/* <div className=""> */}
      <Avatar>
        {/* 用户 */}
        <AvatarImage src={user?.avatar} />
        <AvatarFallback>{user.title?.substring(0, 2)}</AvatarFallback>
      </Avatar>
      {/* </div> */}
      <div className="flex flex-col flex-1 min-w-0 @xl:flex-row">
        <h2 className="truncate" title={user.title}>
          {user.title}
        </h2>
      </div>
      <div className="flex flex-col flex-1 min-w-0 @xl:flex-row">
        <h2 className="truncate" title={user.id}>
          {user.id}
        </h2>
      </div>
      {/* 用户分组 */}
      <div className="flex flex-col flex-1 min-w-0 @xl:flex-row">
        <h2 className="truncate" title={user.groups}>
          {user.groups}
        </h2>
      </div>
      <div>
        <h2 className="truncate" title="邮箱">
          {user.email}
        </h2>
      </div>
      <div>
        <h2 className="truncate" title="角色">
          {user.role === 'admin' ? '管理员' : '普通用户'}
        </h2>
      </div>
      <div>
        <h2 className="truncate" title="组织">
          {user.orgId}
        </h2>
      </div>
      <div>
        <Badge
          className={cn('bg-green-500 hover:bg-green-400', {
            'bg-red-500 hover:bg-red-400': user?.disabled,
          })}>
          {user?.disabled ? '禁用' : '启用'}
        </Badge>
      </div>

      <div>
        <UserEditDialog user={user} onEdit={() => handleEdit(user)}></UserEditDialog>
        <UserDeleteDialog user={user} onDelete={() => handleDelete(user)}></UserDeleteDialog>
      </div>
    </div>
  );
};
