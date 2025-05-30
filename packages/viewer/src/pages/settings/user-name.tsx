/**
 * @author
 * @file user-name.tsx
 * @fileBase user-name
 * @path projects\web-client\src\pages\settings\user-name.tsx
 * @from
 * @desc
 * @example
 */

import { CallModule, UserModule } from '@/app';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useModuleStore } from '@voerka/react';
import { useState, useEffect, memo } from 'react';
export interface UserNameProps {
  // value: any
}
export const UserName: React.FC<UserNameProps> = () => {
  const userModuleStore = useModuleStore<UserModule>('user');
  const [username] = userModuleStore.useReactive('user.name');
  return (
    <div>
      <Label htmlFor="userId">账号</Label>
      <Input id="userId" value={username} readOnly />
    </div>
  );
};

// 默认导出
export default UserName;
