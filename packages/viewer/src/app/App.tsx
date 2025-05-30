/**
 * @author
 * @file App.tsx
 * @fileBase App
 * @path projects\web-client\src\app\App.tsx
 * @from
 * @desc
 * @example
 */

import { App as IndependenceApp } from './as-independence/App';
export interface AppProps {
    // value: any
}
export const App: React.FC<AppProps> = () => {
    return <IndependenceApp />;
};

// 默认导出
export default App;
