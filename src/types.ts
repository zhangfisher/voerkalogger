import { LogLevel } from "./consts"


export interface LoggerOptions{
    enabled?:boolean
    level?:LogLevel                          // 日志级别
    debug?:boolean
    output?: string
    catchGlobalErrors?: boolean
    backends?:Record<string,BackendBaseOptions>;
    [key: string]:any
}


export interface LogRecord{
    message: string 
    level: LogLevel
    timestamp?: string
    error?: any
    tags?:string[]
    read?:boolean                               // 是否已读    
    module?:string,
    [key: string]:any
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


 