/**
 * @author
 * @file App.tsx
 * @fileBase App
 * @path projects\web-client\src\app\as-plugin\App.tsx
 * @from
 * @desc
 * @example
 */

import { AppDialog } from './AppDialog';
import { FloatAppEntry } from './FloatAppEntry';

export const App: React.FC = () => {
  return (
    <AppDialog>
      <FloatAppEntry></FloatAppEntry>
    </AppDialog>
  );
};

// 默认导出
export default App;
