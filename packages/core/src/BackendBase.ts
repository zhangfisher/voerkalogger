import type { DeepRequired } from "ts-essentials"
import *  as formatters from "./formatters"
import { BackendBaseOptions, VoerkaLoggerFormatter, VoerkaLoggerRecord } from "./types"
import { VoerkaLogger } from './Logger';

 
/** 
 * 
 * <OutputRecord> 是日志经过Formatter后的输出结果类型 
*/
export class BackendBase<Options extends BackendBaseOptions = BackendBaseOptions,OutputRecord = VoerkaLoggerRecord >{
    #options:DeepRequired<Options>
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
     * 格式化为输出格式，一般会输出为字符串，但是也可以是任意格式，比如二进制等，取决于后端实现
     * 
     * 各后端可以根据需要重载此方法，实现
     *
     * @param {*} record = {message: string, level: number, timestamp: string, error: *,tags:[],module:string}
     * @param context
     */
    format(record:VoerkaLoggerRecord):Promise<OutputRecord>{
        return new Promise<OutputRecord>(resolve => {
            resolve(record as OutputRecord);
        })           
    }

    /**
     * 清除所有存储的日志
     */
    async clear(){
        console.clear()
    } 
    /**
     * 本方法由日志实例调用
     * @param {*} info =  {{message: string, level: number, timestamp: string, error: *,tags:[],module:string}}
     */
    async _output(record:VoerkaLoggerRecord){
        if(!this.options.enabled) return        
        // 进行格式化,然后再输出
        const result = await this.format(record) 
        await this.output(result,record)
    }

    /**
     * 此方法由子类重载
     * @param {*} result   经过格式化处理后的日志记录，取决于配置，可能是字符串，也可能是{}
     * @param {*} record  原始日志记录{}
     */
    async output(result:OutputRecord,record:VoerkaLoggerRecord){

    }
}

 