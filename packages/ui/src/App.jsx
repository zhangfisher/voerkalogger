/**
 * @author
 * @file App.jsx
 * @fileBase App
 * @path src\App.jsx
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

import { useEffect } from "react";
import { RouterProvider } from "react-router";
import mqttClient from "./messageManager";
import router from "./router";
// function Navigation() {
//   useGlobalRouter();
//   return (
//     <Routes>
//       <Route path="/" element={<Home></Home>}></Route>
//       <Route path="/login" element={<Login></Login>}></Route>
//     </Routes>
//   );
// }
import { useSystemTheme } from "@tikkhun/react-ui";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import Home from "./pages/Home";
function App() {
  const systemTheme = useSystemTheme();
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: systemTheme === "dark" ? theme.darkAlgorithm : undefined,
      }}
    >
      <AntdApp>
        <Home />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
