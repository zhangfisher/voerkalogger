import moduleTools, { defineConfig } from '@modern-js/module-tools'
import type { CliPlugin, ModuleTools } from '@modern-js/module-tools';
// import copy from "esbuild-copy-files-plugin";

const esbuildOptions = {
  plugins: [
    //@ts-ignore
    // copy({
    //   source: ['package.json', 'README.md', 'LICENSE'],
    //   target: "dist/"
    // })
  ],
  banner: {
    js: `/**
*        
*   ---=== VoerkaLogger ===---
*   https://zhangfisher.github.com/voerkalogger
* 
*   简单日志输出库
*
*/`}
}

const ModulePlugin = (): CliPlugin<ModuleTools> => ({
  name: 'module',
  setup: () => ({
    modifyLibuild(config: { esbuildOptions: (c: any) => any; format: string; }) {
      config.esbuildOptions = c => {
        c.banner = esbuildOptions.banner;
        c.plugins?.push(...esbuildOptions.plugins);
        c.entryNames = '[dir]/[name]'
        c.chunkNames = '[name]-[hash]';
        if (config.format === 'esm') {
          c.outExtension = { '.js': '.mjs' }
        }else if(config.format === 'umd'){
            c.outExtension = { '.js': '.umd.js' }
        }
        return c;
      };
      return config;
    },
  }),
});

export default defineConfig({
  plugins: [moduleTools(), ModulePlugin()],
  buildConfig: [
    {
      input: ['src/index.ts'],
      format: 'esm',
      splitting: false,
      sourceMap: false, 
      minify:false,
      dts: false,
      target: 'es2021',
    }, 
    {
      buildType: 'bundleless',
      dts: {
        only: true
      }
    },
    {
      input: ['src/index.ts'],
      format: 'cjs',
      splitting: false,
      sourceMap: false,
      minify: false,//'esbuild',
      dts: false,
      target: 'es2021',
    }
  ]
}) 