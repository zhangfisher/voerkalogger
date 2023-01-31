import { LogLevel } from "./consts"
import { BackendBase } from './BackendBase';
import { BatchBackendBase } from './BatchBackendBase';

// 日志配置
export interface LoggerOptions{
    enabled?:boolean                                    // 全局开关
    level?:LogLevel                                     // 全局日志级别
    debug?:boolean                                      // 是否在调试阶段，=true时所有日志均会输出
    output?: string[]                                   // 启用的输出后端
    context?:Record<string,any>  | null                        // 全局上下文，可以用为输出时的插值变量
    catchGlobalErrors?: boolean                         // 是否捕获全局错误
    tags?:string[],                                     // 全局标签
    backends:(BackendBase | BatchBackendBase)[]         // 注册的格式化器实例，也可以调用.use注册后端
}

// 日志记录
export interface LogRecord{
    message: string                             // 日志信息
    level: LogLevel                             // 日志级别
    timestamp?: number                          // 时间戳
    error?: string | Error                      // 错误信息
    tags?:string[]                              // 日志标签
    module?:string,                             // 应用模块名称或源文件
    [key: string]:any                           // 额外的信息
}

export type LogMethodOptions =Partial<Omit<LogRecord,'message' & 'timestamp'>>
export type LogMethodVars = Record<string,any> | any[] | Error  | Function | any


export interface BackendBaseOptions{
    enabled?   : boolean
    format?   : string | Function | boolean | null
    level?    : LogLevel
    [key: string]: any
}

export interface BatchBackendBaseOptions extends BackendBaseOptions {
    flushInterval?:number                   // 延迟输出时间间隔
    bufferSize?:number                      // 默认缓冲区大小，如果需要一条一条即刻输出可以指定为1
}


export interface LogFormatter{
    (record:LogRecord):any
}
export type LogFormatters = Record<string,LogFormatter>


 