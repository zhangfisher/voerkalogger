/* eslint-disable no-undef */
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import topLevelAwait from "vite-plugin-top-level-await";
import packageJson from "./package.json";

const env = loadEnv("", process.cwd());
const resolve = (dir) => path.join(__dirname, dir);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          title: env.VITE__PROJECT__TITLE,
        },
      },
    }),
    react(),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ],
  base: "",
  define: {
    __APP_NAME__: JSON.stringify(packageJson.name),
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __APP_BUILD_TIME__: JSON.stringify(new Date()),
    __APP_VERSION_TAG__: JSON.stringify(packageJson.versionTag),
  },
  build: {
    sourcemap: false
  },
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  esbuild: {
    include: /\.[jt]sx?$/,
    exclude: [],
    loader: "jsx",
  },

  server: {
    host: "0.0.0.0",
    proxy: {
      "^/voerka": {
        target: env.VITE__VOERKA__HTTP__PROXY || "http://127.0.0.1:3000",
        rewrite: (path) => path.replace(/^\/voerka/, ""),
        // ws: true,
        changeOrigin: true,
      },
    },
  },
});
