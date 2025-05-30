/**
 * @author
 * @file DeptAddChildDialog.tsx
 * @fileBase DeptAddChildDialog
 * @path projects\web-client\src\pages\UserOrg\UserOrgAddChildDialog.tsx
 * @from
 * @desc
 * @example
 */
import { createDept } from '@/api/dept';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TreeNode } from './TreeNode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
export interface DeptAddFormValue {
  title: string;
}
export const createDeptSchema = z.object({
  title: z.string().optional(),
});
export const DeptAddChildForm: React.FC<{
  defaultValues?: { title: string };
  onSubmit: (values: DeptAddFormValue) => void;
}> = ({ defaultValues = { title: '' }, onSubmit }) => {
  const form = useForm<DeptAddFormValue>({
    resolver: zodResolver(createDeptSchema),
    defaultValues,
  });
  return (
    <div>
      <Form {...form}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>部门名称</FormLabel>
              <FormControl>
                <Input placeholder="部门名称" {...field}></Input>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          )}></FormField>
        <DialogFooter className="my-2">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="text-white bg-primary hover:bg-secondary-foreground">
            提交
          </Button>
          <DialogClose>取消</DialogClose>
        </DialogFooter>
      </Form>
    </div>
  );
};

interface UserOrgAddChildDialogProps {
  node: TreeNode;
  open: boolean;
  onOpenChagne: (open: boolean) => void;
  onSubmit: Function;
}
export const DeptAddChildDialog: React.FC<DeptAddChildDialogProps> = ({
  open,
  onOpenChange,
  node,
  onSubmit,
}) => {
  const handleAddChild = async (data: any) => {
    try {
      console.log(`data`, data);
      const result = await createDept({
        ...data,
        title: data.title || '新建部门',
        parentNodeId: node.id,
      });
      toast.success(`为名为${node?.title}的部门添加节点成功`);
      await onSubmit(result);
      onOpenChange(false)
    } catch (error: any) {
      toast.error(`为名为${node?.title}的部门添加节点失败`, {
        description: error?.message,
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-2 w-full">
        <DialogHeader>
          <DialogTitle>新建部门</DialogTitle>
        </DialogHeader>
        <DeptAddChildForm onSubmit={handleAddChild}></DeptAddChildForm>
      </DialogContent>
    </Dialog>
  );
};

// 默认导出
export default DeptAddChildDialog;
