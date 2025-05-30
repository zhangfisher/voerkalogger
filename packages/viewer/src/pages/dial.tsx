// Dial.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useCallModule } from "@/app/modules/call/hooks/useCallModule";

// 定义表单验证schema
const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "电话号码不能为空")
    .regex(/^[0-9A-Za-z]+$/, "只能输入数字和字母"),
});

type FormValues = z.infer<typeof formSchema>;

const Dial = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });
  const callingManager = useCallModule();
  const onSubmit = (data: FormValues) => {
    console.log(`data`, data);
    console.log(`callingManager`, callingManager);
    (globalThis as any).$callingManager?.callOut(data.phoneNumber);
  };

  return (
    <div className="flex items-center justify-center h-full max-h-screen bg-primary-foreground">
      <div className="w-full max-w-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">拨打电话</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="请输入电话号码"
                        {...field}
                        onChange={(e) => {
                          // 清除非数字和字母字符
                          const value = e.target.value.replace(
                            /[^0-9A-Za-z]/g,
                            ""
                          );
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className="w-24"
              >
                <Phone className="w-4 h-4 mr-2" />
                拨打
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Dial;
