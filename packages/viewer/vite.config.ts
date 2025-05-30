import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, Plugin } from 'vite';
const env = loadEnv('', process.cwd());
import { codeInspectorPlugin } from 'code-inspector-plugin';
import manifest from './as-extension/manifest.json';
import { crx } from '@crxjs/vite-plugin';
// import utwm from 'unplugin-tailwindcss-mangle/vite';
// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        react({
            tsDecorators: true,
        }),
        // @ts-ignore
        // utwm({
        //     classGenerator: {
        //         classPrefix: 'voerka-phone-',
        //     },
        // }) as Plugin,
        // @ts-ignore
        crx({ manifest }) as Plugin,
        mode === 'development' ? codeInspectorPlugin({ bundler: 'vite' }) : undefined,
    ],
    build: {
        sourcemap: mode === 'development',
        target: ['es2022', 'chrome100', 'safari13'],
        outDir: 'dist',
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        host: '0.0.0.0',
        proxy: {
            '^/api': {
                target: env.VITE__VOERKA__SERVER__PROXY || 'http://127.0.0.1:8000/api/',
                rewrite: (path) => path.replace(/^\/api/, ''),
                // ws: true,
                changeOrigin: true,
            },
        },
    },
}));
