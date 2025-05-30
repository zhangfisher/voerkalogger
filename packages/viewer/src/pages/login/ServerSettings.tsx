/**
 * @author
 * @file serverSettings.tsx
 * @fileBase serverSettings
 * @path projects\web-client\src\pages\login\serverSettings.tsx
 * @from
 * @desc
 * @example
 */

import { useModuleStore } from '@voerka/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export const ServerSettingForm: React.FC = () => {
  const callStore = useModuleStore('call');
  const appStore = useModuleStore('app');
  const [baseURL] = appStore.useReactive('baseURL');
  const [peerHost, setPeerHost] = callStore.useReactive('connectOpts.host');
  const [peerPort, setPeerPort] = callStore.useReactive('connectOpts.port');
  const [peerPath, setPeerPath] = callStore.useReactive('connectOpts.path');
  return (
    <div className="flex flex-col p-2">
      <div>
        <Label htmlFor="baseURL">API接口</Label>
        <Input id="baseURL" value={baseURL} />
      </div>

      <div>
        <Label htmlFor="peerHost">通话域名</Label>
        <Input
          id="peerHost"
          type="text"
          value={peerHost}
          onChange={(e) => setPeerHost(e.target.value)}
          placeholder="请输入 Peer Host"
        />
      </div>

      <div>
        <Label htmlFor="peerPort">通话地址</Label>
        <Input
          id="peerPort"
          type="number"
          value={peerPort}
          onChange={(e) => setPeerPort(Number(e.target.value))}
          placeholder="请输入 Peer Port"
        />
      </div>

      <div>
        <Label htmlFor="peerPath">通话路径</Label>
        <Input
          id="peerPath"
          type="text"
          value={peerPath}
          onChange={(e) => setPeerPath(e.target.value)}
          placeholder="请输入 Peer Path"
        />
      </div>
    </div>
  );
};
export const ServerSettings: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button variant="ghost">
            <Settings size={24} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{'接口配置'}</DialogTitle>
        </DialogHeader>
        <div className="">
          <ServerSettingForm></ServerSettingForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};
// 默认导出
export default ServerSettings;
