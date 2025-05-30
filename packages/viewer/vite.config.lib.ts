import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { toBigCamelCase } from '@tikkhun/utils-core';
import packageJson from './package.json';
import { fileURLToPath, URL } from 'node:url';
import dts from 'vite-plugin-dts';
import utwm from 'unplugin-tailwindcss-mangle/vite';

import { replaceCodePlugin } from 'vite-plugin-replace';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
const name = 'voerka-phone';
const env = loadEnv('', process.cwd());
export default defineConfig({
    plugins: [
        react(),
        // @ts-ignore
        utwm(),
        // replaceCodePlugin({
        //   replacements: [
        //     {
        //       from: "process.env.NODE_ENV",
        //       to: JSON.stringify(env),
        //     },
        //   ],
        // }),
        dts({
            outDir: 'types',
            tsconfigPath: 'tsconfig.app.json',
        }),
        cssInjectedByJsPlugin({
            topExecutionPriority: false,
        })
    ],
    define: {
        'process.env': env,
    },
    build: {
        sourcemap: true,
        lib: {
            entry: './src/app/index.ts',
            name: toBigCamelCase(name),
            fileName: name,
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: true, // 将动态导入的模块内联
                // 设置为 false 来禁用代码分割
                // manualChunks: undefined, // 所有模块都放到同一个 Chunk
                // manualChunks: (id) => {
                //   // 将所有模块都放入同一个 Chunk
                //   return "everything";
                // },
            },
        },
    },

    server: {
        host: '0.0.0.0',
        proxy: {
            // "^/peer-server": {
            //   target: env.VITE__VOERKA__PEER_SERVER__PROXY || "http://127.0.0.1:3000",
            //   rewrite: (path) => path.replace(/^\/peer-server/, ""),
            //   // ws: true,
            //   changeOrigin: true,
            // },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
