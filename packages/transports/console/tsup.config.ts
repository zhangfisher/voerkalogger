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
    // noExternal:["flex-tools","logsets"],
    banner: {
        js: `/**
*        
*   ---=== Colorized of console Transport For VoerkaLogger  ===---
*   https://zhangfisher.github.com/voerkalogger
* 
*   支持彩色控制台输出
*
*/`}
}) 