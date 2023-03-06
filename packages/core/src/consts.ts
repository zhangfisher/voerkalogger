import { VoerkaLoggerOptions } from "./types";


export enum VoerkaLoggerLevel{
    NOTSET = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
}

export const VoerkaLoggerLevelNames = [ 'NOSET', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL' ];


export const DefaultLoggerOptions:VoerkaLoggerOptions = {
    id:"",
    enabled:true,
    level:  VoerkaLoggerLevel.WARN,
    debug:  false,
    output: [process.env.NODE_ENV === 'test' ?  "file" : 'console'],
    injectGlobal:true,                          // 在globalThis注入一个logger全局变量
    catchGlobalErrors: true,                    // 是否自动捕获全局错误
    scope:{}
}  
 



 