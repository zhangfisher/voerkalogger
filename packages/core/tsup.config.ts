import { defineConfig } from 'tsup'

export default defineConfig([
    {
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
        banner: {
            js: `/**
    *        
    *   ---=== VoerkaLogger ===---
    *   https://zhangfisher.github.com/voerkalogger
    * 
    *   轻量易用的日志输出库
    *
    */`}
    },
    {
        entry: [
            'src/index.ts'
        ],
        format: ['iife'],
        splitting: false,
        sourcemap: true,
        clean: true,
        treeshake:true,  
        minify: false,
        banner: {
            js: `/**
    *        
    *   ---=== VoerkaLogger ===---
    *   https://zhangfisher.github.com/voerkalogger
    * 
    *   轻量易用的日志输出库
    *
    */`}
    }
]) 