
import mapValues from "lodash/mapValues";
import dayjs from "dayjs";
import isError from "lodash/isError";
import isFunction from "lodash/isFunction";
import type { LogMethodOptions, LogMethodVars, VoerkaLoggerRecord } from "./types";
import { VoerkaLoggerLevelNames, VoerkaLoggerLevel } from './consts';
import  isPlainObject from "lodash/isPlainObject";
import type { VoerkaLogger } from "./Logger";

/**
 * 执行一个函数，如果出错则返回错误信息
 * @param {*} fn 
 */
function callWithError(fn:Function):any{
    try{
        return fn()
    }catch(e:any){
        return e.stack
    }
}

function getLevelName(level:number):string{
    return VoerkaLoggerLevelNames[level<1 || level>5 ? 3 : level]
}
/**
 * 处理日志参数
 * 
 * 将日志参数转换为日志对象，info = {message,timestamp,tags,module,.....}
 * 
 * @param {*} message  输出日志内容
 * @param {*} vars    插值变量数组或{}
 * @param {*} options 
 * @returns  {Object}  info =  {message,timestamp,tags,module,.....}
 */
export function handleLogArgs(message:string | Function, vars:LogMethodVars,options:LogMethodOptions={}):VoerkaLoggerRecord {
    try{
        let opts = Object.assign({
            tags: [],                       // 
            module: undefined,   		    // 日志来源模块名称
            level:VoerkaLoggerLevel.WARN,					// 默认级别WARN
        }, options)

        let { tags, module, ...extras } = opts
        // 处理插值变量 
        let interpVars = isFunction(vars) ? callWithError(vars) : (isError(vars) ? vars.stack : vars )
        // 执行变量中的函数，如果执行出错则会显示错误信息
        if (Array.isArray(interpVars)) {
            interpVars = interpVars.map(v => (isFunction(v) ?callWithError(v) : (isError(v) ? v.stack: v )))
        } else if (isPlainObject(interpVars)) {
            interpVars = mapValues(interpVars, v => (isFunction(v) ?callWithError(v) : (isError(v) ? v.stack: v )))
        }else{
            interpVars = [String(interpVars)]
        }
        interpVars["levelName"]= getLevelName(interpVars.level)

        // 处理日志信息
        const msg = isError(message) ? message.stack : (isFunction(message) ? callWithError(message) : String(message))

        return {
            ...extras,
            message: Array.isArray(interpVars) ? msg.params(...interpVars) : msg.params(interpVars),
            tags,
            module,
            timestamp: Date.now()
        }
    }catch{
        return {level:VoerkaLoggerLevel.WARN, message:String(message),timestamp: Date.now(),...options}
    }
}

 
/**
 * 返回插值变量字典，用来对message进行插值替换
 */
 export function getInterpolatedVars(this:VoerkaLogger,record:VoerkaLoggerRecord):Record<string,any>{
    const logger = this
    const { message, level, timestamp, error,tags,module,...extras } = record
    let now = dayjs(record.timestamp)
    let levelName = VoerkaLoggerLevelNames[level]
    return { 
        level   : levelName.padEnd(5).toUpperCase(),
        datetime: now.format('YYYY-MM-DD HH:mm:ss SSS').padEnd(23),
        message,
        timestamp,
        date    : now.format('YYYY-MM-DD'),
        time    : now.format('HH:mm:ss'),
        tags    : tags ? (Array.isArray(tags) ? tags.join(",") : String(tags)) : '',
        module  : module || '', 
        ...extras,
        ...logger.options.context || {}
    }
}


export function safeCall(fn:Function){
    try{
        return fn()
    }catch{}
}