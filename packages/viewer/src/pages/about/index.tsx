/**
 * @author
 * @file index.tsx
 * @fileBase about
 * @path projects\web-client\src\pages\about\index.tsx
 * @from
 * @desc
 * @example
 */

import { Button } from '@/components/ui/button';
import { useModuleStore } from '@voerka/react';
import { version } from '../../../package.json';
import Panel from './panel';

export interface AboutProps {
  // value: any
}
export const About: React.FC<AboutProps> = () => {
  const appStore = useModuleStore('app');
  const title = appStore.useReactive('title');
  // const name = appStore.useReactive("name");
  return (
    <div className="h-full bg-primary-foreground">
      <div className="max-w-6xl p-2 mx-auto">
        <div className="flex flex-col gap-1">
          <Panel className="flex items-center justify-between w-full space-x-2 bg-card">
            <div>
              <h1 className="font-bold">{title}</h1>
              <span>版本信息: {version}</span>
            </div>
            <Button disabled>检测更新</Button>
          </Panel>
        </div>
        {/* 打包时间 */}
      </div>
    </div>
  );
};
export default About;
