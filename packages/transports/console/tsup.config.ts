import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/index.ts'
    ],
    format: ['esm','cjs','iife'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake:true,  
    minify: true,
    banner: {
        js: `/**
*        
*   ---=== Colorized of console Transport For VoerkaLogger  ===---
*   https://zhangfisher.github.com/voerkalogger 
*   支持彩色控制台输出 
*/`}
}) 