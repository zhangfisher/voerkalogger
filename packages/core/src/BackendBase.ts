import type { DeepRequired } from "ts-essentials"
import { LogMethodVars, VoerkaLoggerFormatter, VoerkaLoggerRecord } from "./types"
import type { VoerkaLogger, VoerkaLoggerLevel  } from './Logger';
import dayjs from "dayjs";
import { outputError } from "./utils";
import { assignObject,asyncSignal,IAsyncSignal,canIterable, AsyncSignalAbort } from "flex-tools";
import { VoerkaLoggerLevelNames  } from "./consts"


export interface BackendBaseOptions<Output=string>{
    enabled?      : boolean                                             // 可以单独关闭指定的日志后端
    level?        : VoerkaLoggerLevel
    format?       : VoerkaLoggerFormatter<Output> | string | null       // 格式化日志
    // 缓冲区满或达到间隔时间时进行日志输出
    // 如果bufferSize=0则禁用输出，比如ConsoleBackend就禁用输出
    bufferSize?   : number                                              // 输出缓冲区大小
    flushInterval?: number                                              // 延迟输出时间间隔，当大于间隔时间j时进行输出
}
 
 
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
            flushInterval:10 * 1000 ,
            format:"[{levelName}] - {datetime} : {message}{<,module=>module}{<,tags=>tags}" 
        }, options) as DeepRequired<Options>
        if(this.#options.enabled) this._outputLogs()
    }
    get level() { return this.#options.level }
    get options() { return this.#options }
    set options(value) { Object.assign(this.#options, value) }
    get buffer() { return this.#buffer}
    get logger() { return this.#logger }    
    get enabled() { return this.#options.enabled }
    set enabled(value) { 
        if(value==this.#options.enabled) return
        this.#options.enabled = value 
        if(value){
            this._outputLogs()
        }else{
            this.destroy()
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
    protected outputError(e:Error){
        outputError(e)
    }
    /**
     * 处理输入的插值变量列表参数
     * @param {string} inVars  log输入的插值变量参数 
     * @return {Array | Record} 位置插值数组或字典
     */
    getInterpVars(record: VoerkaLoggerRecord) {
        const now = dayjs()
        return {
            ...record,
            levelName: VoerkaLoggerLevelNames[record.level < 0 || record.level > 5 ? 0 : record.level].padEnd(5),
            datetime: now.format('YYYY-MM-DD HH:mm:ss SSS').padEnd(23),
            date: now.format('YYYY-MM-DD'),
            time: now.format('HH:mm:ss'),
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
        record.message = record.message.params(interpVars)
        const vars ={
            ...this.getInterpVars(record),
            ...record,
        }
        try {
            return template!.params(vars) as OutputRecord
        } catch (e: any) {
            return `[ERROR] - ${vars.datetime} : ${e.stack}` as OutputRecord
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

    // ***************输出日志***************

    /**
     * 本方法由日志实例调用
     * @param {*} info =  {{message: string, level: number, timestamp: string, error: *,tags:[],module:string}}
     */
     _output(record: VoerkaLoggerRecord, inVars: LogMethodVars) {
        if (!this.options.enabled) return
        const output = this.format(record, inVars)
        if (output && this.options.bufferSize>0){
            this.#buffer.push(output)
            if(this.#buffer.length>=this.options.bufferSize) this.#outputSingal?.resolve() // 有数据进来
        }
    }
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
     */
    _outputLogs() {
        // 如果缓冲区为0,则关闭输出
        if(this.options.bufferSize<=0) return     
        this.#timerId = setTimeout(async () => {
            this.#outputSingal = asyncSignal()
            try{
                while(this.enabled){
                    // 1. 等待有数据或者超时
                    try{
                        await this.#outputSingal(this.options.flushInterval)             
                    }catch(e){ // 当异步信号被销毁时会触发AsyncSignalAbort错误
                        if(e instanceof AsyncSignalAbort)  break
                    }                    
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
     * 马上将缓冲区的内容输出,一般情况下子类不需要重载本方法，而应该重载
     */
    async flush() {
        if (this.#buffer.length == 0) return 
        try {
            await this.output(this.#buffer)
        }catch (e: any) {
            console.error(`[Error] - ${dayjs().format('YYYY-MM-DD HH:mm:ss SSS')} : while output logs,${e.stack}`)
        }finally {
            this.#buffer = []
        }      
    }    
    async destroy() { 
        this.#outputSingal?.destroy()
    }
}

