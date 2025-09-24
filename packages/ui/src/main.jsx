import "@/logger";
// import { store } from "@/store";
import { ClickScrollPlugin, OverlayScrollbars } from "overlayscrollbars";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "overlayscrollbars/overlayscrollbars.css";
import "./assets/iconfont/iconfont.css";
import "@tikkhun/react-ui/dist/style.css";
import "./index.css";
// Logger.debug("666");
import { printAppInfo } from "@/utils/printAppInfo";
printAppInfo();
OverlayScrollbars.plugin(ClickScrollPlugin);
async function bootstrap() {
  // const config = await loadConfig();
  // const app = await createApp(config);
  // const store = await createStore(config);
  // const router = await createRouter(config);
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      {/* <Provider store={store}> */}
      <App />
      {/* </Provider> */}
    </StrictMode>
  );
}
bootstrap();
