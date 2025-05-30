/**
 * @author
 * @file UserList.tsx
 * @fileBase UserList
 * @path projects\web-client\src\pages\user-admin\UserList.tsx
 * @from
 * @desc
 * @example
 */

import { UserEntity } from '@/api/user.types';
import { useState } from 'react';
import { UserBar } from './UserBar';
export interface UserListProps {
  users: UserEntity[];
  refresh: Function;
  mutate: Function;
}
export const UserList: React.FC<UserListProps> = ({ users, refresh, mutate }) => {
  const [userEditDialogOpen, setUserEditDialogOpen] = useState(false);
  function handleEdit(user: UserEntity) {
    setUserEditDialogOpen(true);
    refresh();
  }
  function handleDelete(user: UserEntity) {
    mutate({ data: users.filter((user) => user.id !== user.id) });
    // 这里要弹窗
  }
  return (
    <>
      {users.map((user, index) => (
        <UserBar
          user={user}
          key={index}
          handleEdit={handleEdit}
          handleDelete={handleDelete}></UserBar>
      ))}
    </>
  );
};

// 默认导出
export default UserList;
