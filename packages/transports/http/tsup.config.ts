import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/index.ts'
    ],
    format: ['esm','cjs'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake:true,  
    minify: true,
    noExternal:["lodash"],
    banner: {
        js: `/**
*        
*   ---=== Http Transport For VoerkaLogger ===---
*   https://zhangfisher.github.com/voerkalogger
* 
*   轻量易用的日志输出库
*
*/`}
}) 