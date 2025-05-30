// LoginPage.tsx
import { AuthModule } from '@/app';
import { DottedBackground } from '@/components/dotted-background';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModule } from '@voerka/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import * as z from 'zod';
import { ServerSettings } from './ServerSettings';
// 定义表单验证模式
const loginSchema = z.object({
  username: z.string(),
  // .min(3, { message: "用户名至少需要3个字符" })
  // .max(20, { message: "用户名不能超过20个字符" }),
  password: z
    .string()
    .min(3, { message: '密码至少需要6个字符' })
    .max(50, { message: '密码不能超过50个字符' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
export default Login;
function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const authModule = useModule<AuthModule>('auth');
  // 初始化表单
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // 处理表单提交
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      // 这里添加你的登录逻辑
      await authModule.loginAndGetUser(data);
      // logger.debug(`登录结果数据为: {}`, () => JSON.stringify(res));
      toast.success('登录成功');
      // logger.debug(`登录成功, searchParams为: {}`, () => JSON.stringify(searchParams));
      navigate(searchParams.get('redirect') || '/');
    } catch (error) {
      toast.error('登录失败', {
        description: '用户名或密码错误',
      });
      logger.error(`登录失败,失败消息为：{}`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DottedBackground className="w-full h-full center">
      <Card className="w-[400px] margin-auto">
        <CardHeader>
          <CardTitle className="">
            <div className="relative w-full text-2xl text-center">
              用户登录
              <div className="absolute right-0 transform -translate-y-1/2 top-1/2">
                <ServerSettings></ServerSettings>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入用户名" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请输入密码"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DottedBackground>
  );
}
