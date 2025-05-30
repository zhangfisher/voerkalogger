/**
 * @author
 * @file UserDeleteDialog.tsx
 * @fileBase UserDeleteDialog
 * @path projects\web-client\src\pages\user-admin\UserDeleteDialog.tsx
 * @from
 * @desc
 * @example
 */
import { deleteDept } from '@/api/dept';

import { UserEntity } from '@/api/user.types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { type TreeNode } from './TreeNode';

export interface DeptDeleteDialogProps {
  node: TreeNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: Function;
}

export const DeptDeleteDialog: React.FC<DeptDeleteDialogProps> = ({
  open = false,
  onOpenChange,
  node,
  onSubmit,
}) => {
  async function handleDelete(node: TreeNode) {
    try {
      await deleteDept(node.id as number);
      toast.success(`删除名为${node.title}的部门节点成功`);
      await onSubmit(node);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`删除名为${node.title}的部门节点失败`, {
        description: error?.message,
      });
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定删除名为{node?.title}的节点?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-400"
            onClick={() => handleDelete(node)}>
            确定
          </AlertDialogAction>
          <AlertDialogCancel>取消</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// 默认导出
export default DeptDeleteDialog;
