import type { DeepRequired } from "ts-essentials"
import *  as formatters from "./formatters"
import { BackendBaseOptions, LogMethodVars, VoerkaLoggerFormatter, VoerkaLoggerRecord } from "./types"
import { VoerkaLogger, VoerkaLoggerLevelNames } from './Logger';
import dayjs from "dayjs";
import { callWithError } from "./utils";
import isFunction from "lodash/isFunction";
import isError from "lodash/isError";
import { isPlainObject } from "lodash";
import { assignObject,asyncSignal,IAsyncSignal,canIterable } from "flex-tools";


/** 
 * 
 * <OutputRecord> 是日志经过Formatter后的输出结果类型 
*/
export class BackendBase<Options extends BackendBaseOptions = BackendBaseOptions, OutputRecord = string>{
    #options: DeepRequired<Options>
    #buffer: OutputRecord[] = []
    #logger?: VoerkaLogger
    #timerId: any = 0
    #outputSingal?:IAsyncSignal 
    constructor(options?: Options) {
        this.#options = assignObject({
            enabled: true,
            bufferSize:10,
            flushInterval:10 * 1000,
            formats:{
                datetime:["YYYY-MM-DD HH:mm:ss SSS",23],
                date:"YYYY-MM-DD",
                time:"HH:mm:ss"
            }
        }, options) as DeepRequired<Options>
        this._outputLogs()
    }
    get level() { return this.#options.level }
    get options() { return this.#options }
    set options(value) { Object.assign(this.#options, value) }
    get logger() { return this.#logger }
    
    get enabled() { return this.#options.enabled }
    set enabled(value) { 
        if(value==this.#options.enabled) return
        this.#options.enabled = value 
        if(value){
            this._outputLogs()
        }    
    }

    /**
     * 绑定日志实例
     * @param logger 
     * @param VoerkaLogger 
     */
    _bind(logger: VoerkaLogger) {
        this.#logger = logger
    }

    /**
     *  格式化器支持字符串，或者函数
     * 
     */
    getFormatter(): VoerkaLoggerFormatter<OutputRecord> {
        const formatter = this.options.format
        if (typeof (formatter) === "function") {   // 函数：输入参数时info
            return formatter as VoerkaLoggerFormatter<OutputRecord>
        } else if (typeof (formatter) === "string") {
            return formatter in formatters ? (formatters as any)[formatter] : formatters.default
        } else {
            return formatters.default
        }

    }
    /**
     * 处理输入的插值变量列表参数
     * @param {string} inVars  log输入的插值变量参数 
     * @return {Array | Record} 位置插值数组或字典
     */
    getInterpVars(record: VoerkaLoggerRecord, inVars: LogMethodVars) {
        const now = dayjs()
        // 处理插值变量
        let vars = inVars
        try {
            if (isFunction(vars)) vars = callWithError(vars)
            if (isError(vars)) vars = { error: vars.message, errorStack: vars.stack }
            if (!isPlainObject(vars) && !Array.isArray(vars)) vars = [vars]
        } catch { }

        if (canIterable(vars)) { // 使用位置插值
            return vars
        } else {                // 命名字典插值
            return {
                ...record,
                ...vars,
                levelName: VoerkaLoggerLevelNames[record.level < 0 || record.level > 5 ? 0 : record.level].padEnd(5),
                datetime: now.format('YYYY-MM-DD HH:mm:ss SSS').padEnd(23),
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
    format(record: VoerkaLoggerRecord, interpVars: LogMethodVars): OutputRecord {
        const template = typeof (this.options.format) == 'function' ? this.options.format.call(this, record, interpVars, this) as unknown as string : this.options.format
        let vars
        // 如果只有位置插值，则代表插值只对message进行，否则就会出现插值不匹配的情况
        if (Array.isArray(interpVars)) {
            vars = {
                ...this.getInterpVars(record, {}),
                message: record.message.params(interpVars)
            }
        } else {
            vars = interpVars
        }
        try {
            return template!.params(vars) as OutputRecord
        } catch (e: any) {
            return `[ERROR] - ${vars.datetime} : ${e.stack}` as OutputRecord
        }
    }

    /**
     * 清除所有存储的日志
     */
    async clear() { }
    /**
     * 本方法由日志实例调用
     * @param {*} info =  {{message: string, level: number, timestamp: string, error: *,tags:[],module:string}}
     */
    _output(record: VoerkaLoggerRecord, inVars: LogMethodVars) {
        if (!this.options.enabled) return
        const output = this.format(record, this.getInterpVars(record, inVars))
        if (output && this.options.bufferSize>0){
            this.#buffer.push(output)
            this.#outputSingal?.resolve() // 有数据进来
        }
    }
 
    // ***************输出日志***************

    /**
     * 此方法由子类重载执行输出操作，如写入文件、提交http
     * @param {*} result   经过格式化处理后的日志记录，取决于配置，可能是字符串，也可能是{}
     * @param {*} record  原始日志记录{}
     */
    async output(result: OutputRecord[]) {

    }
    /**
     * 当缓冲区大于指定数量输出，或者达到指定时间间隔也进行输出 
     *  
     * 
     */
    _outputLogs() {
        // 如果缓冲区为0,则关闭输出
        if(this.options.bufferSize<=0) return         
        this.#timerId = setTimeout(async () => {
            this.#outputSingal = asyncSignal()
            try{
                while(this.enabled){
                    // 1. 等待有数据或者超时
                    await this.#outputSingal(this.options.flushInterval)             
                    if(!this.enabled) break
                    // 2. 输出日志数据
                    await this.flush()
                }
            }finally{
                this.#outputSingal.destroy()
            }
        },0)        
    }
    /**
     * 马上将缓冲区的内容输出
     */
    async flush() {
        if (this.#buffer.length == 0) return 
        try {
            await this.output(this.#buffer)
        }catch (e: any) {
            console.error(`[Error] - ${dayjs().format('')} : while output logs,${e.stack}`)
        }finally {
            this.#buffer = []
        }
    }    
    async destroy() {
        clearTimeout(this.#timerId)
        this.#outputSingal?.destroy()
    }
}

