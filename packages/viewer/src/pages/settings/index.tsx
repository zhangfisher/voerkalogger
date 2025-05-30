/**
 * @author
 * @file index.tsx
 * @fileBase settings
 * @path projects\web-client\src\pages\settings\index.tsx
 * @from
 * @desc
 * @example
 */
import CallingSettings from './CallingSettings';
import { IpAddress } from './IpAddress';
import { UserName } from './user-name';

export interface SettingsProps {
  // value: any
}
export const Settings: React.FC<SettingsProps> = () => {
  return (
    <div className="h-full bg-primary-foreground">
      {/* // container */}
      <div className="space-y-4 p-4 max-w-[1200px] mx-auto">
        <CallingSettings></CallingSettings>
      </div>
    </div>
  );
};

// 默认导出
export default Settings;
