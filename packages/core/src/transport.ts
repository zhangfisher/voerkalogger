import type { DeepRequired } from "ts-essentials"
import { LogMethodVars, VoerkaLoggerFormatter, VoerkaLoggerRecord } from "./types"
import type { VoerkaLogger  } from './Logger';
import { normalizeLevel, outputError } from "./utils";
import { VoerkaLoggerLevelNames,VoerkaLoggerLevelName,VoerkaLoggerLevel, DefaultFormatTemplate } from "./consts"
import { assignObject } from "flex-tools/object/assignObject";
import { formatDateTime } from "flex-tools/misc/formatDateTime"
import type {ChangeFieldType} from "flex-tools/types"
import { isPlainObject } from 'flex-tools/typecheck/isPlainObject';

export interface TransportBaseOptions<Output>{
    enable?      : boolean                                             // 可以单独关闭指定的日志后端
    level?        : VoerkaLoggerLevel | VoerkaLoggerLevelName
    format?       : VoerkaLoggerFormatter<Output> | string | null       // 格式化日志
    // 缓冲区满或达到间隔时间时进行日志输出
    // 如果bufferSize=0则禁用输出，比如ConsoleTransport就禁用输出
    bufferSize?   : number                                              // 输出缓冲区大小
    // 当日志enable=false时，输出会缓存到这里，等enable=true时再输出
    cache?:number
}

// 注入format泛型
export type TransportOptions<T extends TransportBaseOptions<any>> = T & {
    format?:((...args:Parameters<Exclude<T['format'],string | null | undefined>>)=>ReturnType<Exclude<T['format'],string | null | undefined>>) | string | null
}

// 输出类型
export type TransportOutputType<T extends TransportBaseOptions<any>> =  T['format'] extends string | null | undefined ? T['format'] :ReturnType<Exclude<T['format'],string | null | undefined>>

/** 
 * 
 * <Output> 是日志经过Formatter后的输出结果类型 
*/
export class TransportBase<Options extends TransportBaseOptions<any> = TransportBaseOptions<any>>{
    private _options: ChangeFieldType<DeepRequired<Options>,'level',VoerkaLoggerLevel>
    private _buffer: TransportOutputType<Options>[] = []
    private _inBuffer: TransportOutputType<Options>[] = []
    private _logger?: VoerkaLogger
    private _timerId: any = 0
    private _available:boolean = true                // 是否可用,比如HttpTransport参数没有提供配置参数时就不可用
    private _flushing:boolean = false                // 是否正在输出
    constructor(options?: TransportOptions<Options>) {
        this._options = assignObject({
            level:VoerkaLoggerLevel.NOTSET,
            enable: true,
            bufferSize:100,
            format:DefaultFormatTemplate
        }, options) 
        this._options.level = normalizeLevel(this._options.level)
    }
    get available(){ return this._available }
    get level() { return this._options.level  }
    set level(value:VoerkaLoggerLevel | VoerkaLoggerLevelName){        
        this._options.level = normalizeLevel(value)
    }
    get options() { return this._options }
    set options(value) {     
        if(isPlainObject(value)){
            this.updateOptions(value) 
        }    
    }
    get buffer() { return this._buffer}
    get logger() { return this._logger }    
    get enable() { return this._options.enable }
    set enable(value) { 
        if(value==this._options.enable) return
        this._options.enable = value 
        if(value){
            this.flush()
        }
    }
    private updateOptions(value:any){
        const opts = Object.assign({},value)
        if(opts.level) opts.level = normalizeLevel(opts.level)
        Object.assign(this._options, value)        
        this.onOptionUpdated(Object.keys(value))
    }
    /**
     * 当配置发生变化时调用，供子类重载实现
     * @param options 
     */
    onOptionUpdated(optionKeys:string[]) {

    }    
    /**
     * 绑定日志实例
     * @param logger 
     * @param VoerkaLogger 
     */
    _bind(logger: VoerkaLogger) {
        this._logger = logger
        this._available = this.isAvailable()
        // 检查是否可用，如果不可用则需要在控制台输出警告
        if(!this._available){
            this.logger?.log("VoerkaLogger <{}> is not available!",[this.constructor.name],{
                level:VoerkaLoggerLevel.WARN,
            },['console'])          
        }
        if(this._options.enable) this.flush()   
    }
    protected outputError(e:Error){
        outputError(e)
    }
    /**
     * 返回当前Transport是否可用，由子类实现
     * 比如HttpTransport参数没有提供url配置参数时就不可用
     * @returns 
     */
    isAvailable():boolean{ 
        return true
    }
    /**
     * 处理输入的插值变量列表参数
     * @param {string} inVars  log输入的插值变量参数 
     * @return {Array | Record} 位置插值数组或字典
     */
    getInterpVars(record: VoerkaLoggerRecord) {
        const now = Date.now()
        return {
            ...record,
            levelName: VoerkaLoggerLevelNames[record.level < 0 || record.level > 5 ? 0 : record.level].padEnd(5),
            datetime: formatDateTime(now,'YYYY-MM-DD HH:mm:ss SSS').padEnd(23),
            date: formatDateTime(now,'YYYY-MM-DD'),
            time: formatDateTime(now,'HH:mm:ss'),
        }
    }
    /**
     * 格式化为输出格式，一般会输出为字符串，但是也可以是任意格式，比如二进制等，取决于后端实现
     * 
     * 各后端可以根据需要重载此方法 
     * 
     * 默认输出全本
     *
     * @param {*} record = {message: string, level: number, args:any[] | Record<string,any>,timestamp: string, error: *,tags:[],module:string}
     * @param context
     */
    format(record: VoerkaLoggerRecord, interpVars: LogMethodVars): TransportOutputType<Options> {        
        record.message = record.message.params(interpVars)        
        const formatter = this.options.format
        if(typeof (formatter) == 'function'){
            return formatter.call(this, record, interpVars) as TransportOutputType<Options>
        }else if(typeof formatter == 'string'){
            const vars ={
                ...this.getInterpVars(record),
                ...record,
            }
            try {
                return formatter!.params(vars) as TransportOutputType<Options>
            } catch (e: any) {                
                return `[ERROR] - ${vars.datetime} : ${e.stack}` as TransportOutputType<Options>
            } 
        }else{
            return record as TransportOutputType<Options>
        }  
    }
    // ***************输出日志***************

    /**
     * 本方法由日志实例调用,用户不应该直接调用
     * @param {*} info =  {{message: string, level: number, timestamp: string, error: *,tags:[],module:string}}
     */
     _output(record: VoerkaLoggerRecord, inVars: LogMethodVars) {
        if(!this.enable) return
        // 级别过滤
        if(this._options.level !=VoerkaLoggerLevel.NOTSET && record.level<this._options.level) return
        
        const output = this.format(record, inVars)
        if (output){       // 启用缓冲区
            if(this._flushing ){
                this._inBuffer.push(output)
            }else{
                this._buffer.push(output)// 先放进缓冲区
            }    
            if(this.options.bufferSize>0){                            
                // 当超出缓冲区大小时，立即输出
                if(!this._flushing && this._buffer.length>=this.options.bufferSize){
                    if(this.enable && this.isAvailable()){
                        //当缓冲区大于指定数量输出，或者达到指定时间间隔也进行输出                         
                        this.flush().catch(e=>{
                            this.outputError(e.stack)
                        })      
                    }else{  // 缓冲区满应该删除最早的记录
                        this._buffer.splice(0,1)
                    }
                }
            }else{ 
                
            }
        }
    }
    /**
     * 此方法由子类重载执行输出操作，如写入文件、提交http
     * @param {*} result   经过格式化处理后的日志记录，取决于配置，可能是字符串，也可能是{}
     * @param {*} record  原始日志记录{}
     */
    async output(result: TransportOutputType<Options>[]) {

    } 
    
    /**
     * 马上将缓冲区的内容输出,一般情况下子类不需要重载本方法，而应该重载
     */
    async flush() {
        if(this._flushing) return
        this._flushing = true
        try{
            if (this._buffer.length == 0) return         
            // 不可用时，清空缓冲区
            if(!this._available) {
                this._buffer = []
                return 
            }
            await this.output(this._buffer)  
        }finally{
            this._buffer =[...this._inBuffer]
            this._inBuffer = []
            this._flushing = false
        }        
    }    
    // *************** 操作日志***************
    /**
     * 清除所有存储的日志
     */
     async clear() { 
        //throw new NotImplementedError()
    }
    /**
     * 读取日志
     * @param query  查询字符串，取决具体的实现
     */
    async getLogs(query: string) {
        //throw new NotImplementedError()
    }
}


