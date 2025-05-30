/**
 * @author
 * @file DeptEditDialogDialog.tsx
 * @fileBase DeptEditDialogDialog
 * @path projects\web-client\src\pages\UserOrg\DeptEditDialogDialog.tsx
 * @from
 * @desc
 * @example
 */
import { updateDept } from '@/api/dept';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { TreeNode } from './TreeNode';

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
export const DeptEditDialogForm: React.FC<{
  data: { title: string };
  onSubmit: (values: DeptAddFormValue) => void;
}> = ({ data, onSubmit }) => {
  const form = useForm<DeptAddFormValue>({
    resolver: zodResolver(createDeptSchema),
    defaultValues: data,
  });
  return (
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
          确定
        </Button>
        <DialogClose>取消</DialogClose>
      </DialogFooter>
    </Form>
  );
};

interface DeptEditDialogDialogProps {
  node: TreeNode;
  open: boolean;
  onOpenChagne: (open: boolean) => void;
  onAdd: Function;
}
export const DeptEditDialogDialog: React.FC<DeptEditDialogDialogProps> = ({
  open,
  onOpenChange,
  node,
  onSubmit,
}) => {
  const handleEdit = async (data) => {
    try {
      const result = await updateDept(node.id as number, data);
      toast.success(`修改名为${node.title}的部门节点成功`);
      await onSubmit(result);
      onOpenChange(false)
    } catch (error: any) {
      toast.error(`修改名为${node.title}的部门节点失败`, {
        description: error?.message,
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-2 w-full">
        <DialogHeader>
          <DialogTitle>修改部门信息</DialogTitle>
        </DialogHeader>
        <DeptEditDialogForm data={node} onSubmit={handleEdit}></DeptEditDialogForm>
      </DialogContent>
    </Dialog>
  );
};

// 默认导出
export default DeptEditDialogDialog;
