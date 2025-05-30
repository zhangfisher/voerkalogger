/**
 * @author
 * @file UserDeleteDialog.tsx
 * @fileBase UserDeleteDialog
 * @path projects\web-client\src\pages\user-admin\UserDeleteDialog.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserEntity } from '@/api/user.types';
import { toast } from 'sonner';
import { deleteUser } from '@/api/user';
export interface UserDeleteDialogProps {
  children?: React.ReactNode;
  user: UserEntity;
  onDelete: Function;
}
export const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({ children, user, onDelete }) => {
  async function handleDelete() {
    try {
      await deleteUser(user.id);
      toast.success(`删除用户名为${user.title}的用户成功`);
      onDelete(user);
    } catch (error: any) {
      toast.error(`删除用户名为${user.title}的用户失败`, {
        description: error?.message,
      });
    }
    onDelete(user);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="ghost">
            <Trash2 className="text-red-500"></Trash2>
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定删除用户名为{user.title}的用户?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-red-500 hover:bg-red-400" onClick={() => handleDelete()}>
            确定
          </AlertDialogAction>
          <AlertDialogCancel>取消</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// 默认导出
export default UserDeleteDialog;
