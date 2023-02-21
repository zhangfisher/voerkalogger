import type { DeepRequired } from "ts-essentials"
import *  as formatters from "./formatters"
import { BackendBaseOptions, LogMethodVars, VoerkaLoggerFormatter, VoerkaLoggerRecord } from "./types"
import { VoerkaLogger, VoerkaLoggerLevelNames } from './Logger';
import dayjs from "dayjs";
import { callWithError } from "./utils";
import isFunction from "lodash/isFunction";
import isError from "lodash/isError";
import { isPlainObject } from "lodash";
import { canIterable } from "flex-tools";

 
/** 
 * 
 * <OutputRecord> 是日志经过Formatter后的输出结果类型 
*/
export class BackendBase<Options extends BackendBaseOptions = BackendBaseOptions,OutputRecord = VoerkaLoggerRecord >{
    #options:DeepRequired<Options>
    #buffer:OutputRecord[]=[]
    #logger?:VoerkaLogger 
    constructor(options?:Options){
        this.#options=Object.assign({
            enabled   : true
        },options) as DeepRequired<Options>        
    }
    get level() { return this.#options.level }
    get enabled() { return this.#options.enabled  }
    set enabled(value) { this.#options.enabled = value }
    get options() { return this.#options }
    set options(value) { Object.assign(this.#options, value) }
    get logger() { return this.#logger}    
    /**
     * 绑定日志实例
     * @param logger 
     * @param VoerkaLogger 
     */
    _bind(logger:VoerkaLogger){
        this.#logger = logger
    } 

    /**
     *  格式化器支持字符串，或者函数
     * 
     */
    getFormatter():VoerkaLoggerFormatter<OutputRecord>{
        const formatter = this.options.format
        if(typeof(formatter)==="function"){   // 函数：输入参数时info
            return formatter as VoerkaLoggerFormatter<OutputRecord>
        }else if(typeof(formatter)==="string"){ 
            return formatter in formatters ? (formatters as any)[formatter] : formatters.default
        }else{
            return formatters.default 
        }

    }  
    /**
     * 处理输入的插值变量列表参数
     * @param {string} inVars  log输入的插值变量参数 
     * @return {Array | Record} 位置插值数组或字典
     */
    getInterpVars(record:VoerkaLoggerRecord,inVars:LogMethodVars){
        const now = dayjs()
         // 处理插值变量
         let vars = inVars
         try{
             if(isFunction(vars)) vars = callWithError(vars) 
             if(isError(vars)) vars = {error:vars.message,errorStack:vars.stack} 
             if(!isPlainObject(vars) && !Array.isArray(vars)) vars=[vars]
         }catch{}
         
         if(canIterable(vars)){ // 使用位置插值
            return vars
         }else {                // 命名字典插值
             return {
                ...record,
                ...vars,
                levelName:VoerkaLoggerLevelNames[record.level<0 || record.level>5 ? 0 : record.level].padEnd(5),
                datetime : now.format('YYYY-MM-DD HH:mm:ss SSS').padEnd(23),
                date: now.format('YYYY-MM-DD'),
                time: now.format('HH:mm:ss'),
             }
        }    
    }
    /**
     * 格式化为输出格式，一般会输出为字符串，但是也可以是任意格式，比如二进制等，取决于后端实现
     * 
     * 各后端可以根据需要重载此方法 
     *
     * @param {*} record = {message: string, level: number, args:any[] | Record<string,any>,timestamp: string, error: *,tags:[],module:string}
     * @param context
     */
    format(record:VoerkaLoggerRecord,interpVars:LogMethodVars):OutputRecord{
        if(Array.isArray(interpVars)){
            record.message = record.message.params({
                ...this.getInterpVars(record,{}),
                message: record.message.params(interpVars)
            })
        }    
        return record as OutputRecord
    }

    /**
     * 清除所有存储的日志
     */
    async clear(){    } 
    /**
     * 本方法由日志实例调用
     * @param {*} info =  {{message: string, level: number, timestamp: string, error: *,tags:[],module:string}}
     */
    _output(record:VoerkaLoggerRecord,inVars:LogMethodVars){
        if(!this.options.enabled) return     
        const output = this.format(record,this.getInterpVars(record,inVars)) 
        if(output) this.#buffer.push(output) 
    }

    /**
     * 此方法由子类重载
     * @param {*} result   经过格式化处理后的日志记录，取决于配置，可能是字符串，也可能是{}
     * @param {*} record  原始日志记录{}
     */
    async output(result:OutputRecord,record:VoerkaLoggerRecord){
        
    }
}

 