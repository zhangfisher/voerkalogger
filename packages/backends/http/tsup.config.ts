import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/**/*.ts'
    ],
    format: ['esm','cjs'],
    dts: true,
    splitting: true,
    sourcemap: false,
    clean: true,
    treeshake:true,  
    minify: true,
    noExternal:["lodash"],
    banner: {
        js: `/**
*        
*   ---=== VoerkaLogger Http Backend===---
*   https://zhangfisher.github.com/voerka-logger
* 
*   日志输出库
*
*/`}
}) 