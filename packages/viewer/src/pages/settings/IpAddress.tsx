/**
 * @author
 * @file IpAddress.tsx
 * @fileBase IpAddress
 * @path projects\web-client\src\pages\settings\IpAddress.tsx
 * @from
 * @desc
 * @example
 */

import { CallModule } from '@/app';
import { useModuleStore, useModule } from '@voerka/react';
import { useState, useEffect, memo } from 'react';
export interface IpAddressProps {
  // value: any
}
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
export const IpAddress: React.FC<IpAddressProps> = () => {
  const callModule = useModule<CallModule>('call');
  const callStore = useModuleStore<CallModule>('call');
  const [ipAddress, setIpAddress] = callStore.useReactive('connectOpts.host');
  const [port, setPort] = callStore.useReactive('connectOpts.port');
  return (
    <>
      <div>
        <Label htmlFor="host">通讯地址</Label>
        {/* ip地址的validate */}
        <Input
          id="host"
          value={ipAddress}
          onChange={(e) => {
            const value = e.target.value;
            setIpAddress(value);
          }}
        />
      </div>
      <div>
        <Label htmlFor="port">端口</Label>
        {/* ip地址的validate */}
        <Input
          type="number"
          id="port"
          value={port}
          onChange={(e) => {
            const value = e.target.value;
            setPort(value);
          }}
        />
      </div>
      <Button
        onClick={() => {
          toast('重新连接');
          callModule.initPeer();
        }}>
        重新连接
      </Button>
    </>
  );
};

// 默认导出
export default IpAddress;
