import { TreeSelect } from '@/components/TreeSelect';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { findManyDepts } from '@/api/dept';
import { UserEntity } from '@/api/user.types';
import { useRequest } from 'alova/client';
import { createUser, updateUser, uploadAvatar } from '@/api/user';
import { toast } from 'sonner';
import { AvatarUploader } from './AvatarUploader';
export const updateUserSchema = z.object({
  title: z.string().optional(),
  email: z.string({ message: '请输入字符串' }).email('邮箱格式不正确').optional().or(z.literal('')),
  avatar: z.string().optional(),
  deleted: z.boolean().default(false),
  disabled: z.boolean().default(false),
  role: z.enum(['admin', 'user']),
  deptId: z.number().int().positive('组织ID必须是正整数'),
});

export interface UserEditFormProps {
  // value: any
  user: UserEntity;
  onSubmitSuccess?: Function;
}
export const UserEditForm: React.FC<UserEditFormProps> = ({ user, onSubmitSuccess }) => {
  const { data: depts = {} } = useRequest(findManyDepts, {});
  // const commonLabelWidth = 'w-16';
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });
  async function handleAvatarInputChange(e: React.ChangeEvent<HTMLInputElement>, field: any) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const result = await uploadAvatar(file);
      field.onChange(result);
      toast.success('头像上传成功');
    } catch (error: any) {
      toast.error('头像上传失败', {
        description: error.message,
      });
      field.onchange('');
      // 清空
    }
  }
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof updateUserSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      await updateUser(user.id, values);
      onSubmitSuccess?.();
      toast.success('更新成功');
    } catch (error: any) {
      toast.error('更新失败', {
        description: error?.message,
      });
    }
  }
  return (
    <Form {...form}>
      <div className="grid w-full space-y-4 justify-items-center">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel></FormLabel> */}
              <FormControl>
                <AvatarUploader value={field.value} onValueChange={field.onChange}></AvatarUploader>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-2 justify-items-start w-96">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center w-full">
                <FormLabel className="flex-none w-16">账号名称:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={true} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div>
                  <div className="flex items-center">
                    <FormLabel className="flex-none w-16">全名:</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </div>
                  <div className="flex items-center min-h-0">
                    <div className="w-16"></div>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div>
                  <div className="flex items-center">
                    <FormLabel className="flex-none w-16">邮箱:</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </div>
                  <div className="flex items-center min-h-0">
                    <div className="w-16"></div>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <div>
                  <div className="flex items-center">
                    <FormLabel className="flex-none w-16">角色:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择角色" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">管理员</SelectItem>
                        <SelectItem value="user">普通用户</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center min-h-0">
                    <div className="w-16"></div>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deptId"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center w-full">
                <FormLabel className="flex-none w-16">分组:</FormLabel>
                <TreeSelect
                  value={field.value}
                  data={depts}
                  onChange={(value) => {
                    if (value) {
                      field.onChange(value);
                    }
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
                control={form.control}
                name="appId"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center w-full">
                    <FormLabel className="flex-none w-16">应用ID:</FormLabel>
                    <FormControl>
                      <Input {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
          <FormField
            control={form.control}
            name="disabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormLabel className="flex-none w-16">禁用:</FormLabel>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      <DialogFooter className="gap-2 mx-2">
        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
          确定
        </Button>
        <DialogClose>取消</DialogClose>
      </DialogFooter>
    </Form>
  );
};

// 默认导出
export default UserEditForm;
