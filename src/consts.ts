import { LoggerOptions } from "./types";


export enum LogLevel{
    NOTSET = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
}

export const LogLevelNames = [ 'NOSET', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL' ];


export const DefaultLoggerOptions:Required<LoggerOptions> = {
    enabled: true,
    level:  LogLevel.WARN,
    debug:  false,
    output: process.env.NODE_ENV === 'test' ?  "file" : 'console',
    catchGlobalErrors: true,                // 是否自动捕获全局错误，
    backends:{
        console:{
            enabled: true,
            // 可以独立指定日志级别，0代表使用全局级别，否则会覆盖全局的level设置
            // 此值可以用来让不同的后端分别启用各自的日志级别
            // 比如console.level=1,而indexdb.level=3代表控制台输出所有级别，而indexdb只输出warn级别以上的日志
            level: 0,
            // 格式化参数取值：
            // true/false: false代表不进行格式化原样输出record,true代表使用默认格式输出
            // function: 自定义格式化函数，(record)=>{....}
            // 字符串：  内置的格式化器,取值有default,json
            format: null
        },
        file: {
            enabled     : true,
            maxFileSize: 1024 * 1024 * 10,                      //文件最大字节数
            maxFiles   : 5,                                     // 最多保留5个文件
            format     : '[{level}] {datetime} - {message}'     // 启用的格式化器,支持插值变量
        },
        http: {
            enabled    : true,
            url       : '',
            headers   : {},
            level     : 0,
            bufferSize: 1,
            format    : null
        }
    }
}  
 