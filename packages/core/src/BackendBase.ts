import merge from "lodash/merge"   
import { DeepRequired } from "ts-essentials"
import formatters from "./formatters"
import { BackendBaseOptions, LogFormatter, LogRecord } from "./types"



/**
 * LogRow
 * 
 * 
 * <LogOutputRecord> 是日志经过Formatter后的输出结果类型，可能LogRecord，也可以

*/
export class BackendBase<T extends BackendBaseOptions = any,LogOutputRecord = LogRecord >{
    #options:DeepRequired<T>
    #formatter:LogFormatter = formatters.default
    constructor(options?:T){
        this.#options=Object.assign({
            enabled   : true
        },options || {}) as DeepRequired<T>
    }
    get level() { return this.#options.level }
    get enabled() { 
        return this.#options.enabled 
    }
    set enabled(value) { this.#options.enabled = value }
    get options() { return this.#options }
    set options(value) { merge(this.#options, value) }
    /**
    /** 重置配置参数 
     * @param {*} options 
     */
    async reset(options?:T){
        if(!options) return
        this.#options = options
        this.#formatter = this.getFormatter() 
    }
    /**
     *  格式化器支持字符串，或者函数
     * 
     */
    getFormatter():LogFormatter{
        let formatter = this.options.format
        if(formatter===false){  
            return (record:LogRecord) => record 
        }else if(typeof(formatter)==="function"){   // 函数：输入参数时info
            return formatter as LogFormatter
        }else if(typeof(formatter)==="string" && (formatter in formatters)){ 
            return formatters[formatter] 
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
     format(record:LogRecord):LogOutputRecord{
         if(typeof(this.#formatter)=="function"){
             try{
                 return this.#formatter(record)
             }catch(e){
                return record as LogOutputRecord
             }            
         }else{
            return record as LogOutputRecord
         } 
    }
    /**
     * 清除所有存储的日志
     */
    async clear(){
        console.clear()
    }
    /**
     * 可选的，读取获取日志记录
     * 用来从后端存储中读取日志记录，应用层可以读取显示
        @param {condition}  查询条件
     */
    async getRecords(query:string){
        return []
    }
    /**
     * 本方法由日志实例调用
     * @param {*} info =  {{message: string, level: number, timestamp: string, error: *,tags:[],module:string}}
     */
    protected async _output(record:LogRecord){
        if(!this.options.enabled) return        
        // 进行格式化,然后再输出
        let result = this.format(record) 
        await this.output(result,record)
    }
    /**
     * 此方法由子类重载
     * @param {*} result   经过格式化处理后的日志记录，取决于配置，可能是字符串，也可能是{}
     * @param {*} record  原始日志记录{}
     */
    async output(result:LogOutputRecord,record:LogRecord){

    }
}
