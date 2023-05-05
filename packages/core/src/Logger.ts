/**
 * 日志
 *       logger.level=0       取值0-5
 *
 *          0 : NOTSET	    不输出,enabled=false即level=0
 *          1 : DEBUG
 *          2 : INFO
 *          3 : WARNING
 *          4 : ERROR
 *          5 : FATAL
 *
 *      logger.debug(param1,param2,...)         输出一条调试信息
 *      logger.info(param1,param2,...)          输出一条通知信息
 *      logger.warn(param1,param2,...)          输出一条警告信息
 *      logger.error(param1,param2,...)         输出一条错误信息
 *      logger.fatal(param1,param2,...)
 *
 *      logger.error(message,{})  插件字典
 *      logger.error(message,()=>{}) 第二个参数应该返回一个字典(命名参数)或者数组(位置插值参数)
 *  
 * 
 */
import { DefaultLoggerOptions, VoerkaLoggerLevel  } from "./consts" 
import { safeCall } from "./utils";
import {TransportBase} from "./transport";
import { VoerkaLoggerOptions, LogMethodOptions, LogMethodVars, VoerkaLoggerRecord, LogMethodMessage } from "./types";
import ConsoleTransport from "./console";
import { DeepRequired } from "ts-essentials"  
import { LoggerScopeOptions, VoerkaLoggerScope } from "./scope";
import { assignObject } from "flex-tools/object/assignObject";




export class VoerkaLogger{
    static LoggerInstance:VoerkaLogger;
    #transportInstances:Record<string,TransportBase>={}                     // 后端实例
    #options?:DeepRequired<VoerkaLoggerOptions> 
    #rootScope?:VoerkaLoggerScope
    constructor(options?:VoerkaLoggerOptions) {
        if(VoerkaLogger.LoggerInstance){
            return VoerkaLogger.LoggerInstance
        } 
        this.#options = assignObject(DefaultLoggerOptions,options || {}) as DeepRequired<VoerkaLoggerOptions>  
        // 注册默认的控制台日志输出
        this.use("console",(new ConsoleTransport()) as unknown as TransportBase)
        // 注入全局日志实例
        if(this.options.injectGlobal){
            (globalThis as any)[this.options.injectGlobal===true ? "logger" : this.options.injectGlobal] = this
        }
        // 捕获全局错误,自动添加到日志中
        this.catchGlobalErrors();
        VoerkaLogger.LoggerInstance = this              
        this.#rootScope = new VoerkaLoggerScope(this,{module:this.options.scope.module})  
    }    
    get options() {return this.#options!}    
    get enabled() { return this.options.enabled; }
    set enabled(value) { 
        this.options.enabled = value; 
        for(const transport of Object.values(this.transports)){
            transport.enabled = value
        }
    }
    get level() { return this.options.level }
    set level(value:VoerkaLoggerLevel) {this.options.level = value;} 
    get output() { return this.options.output  }   
    set output(value:string[]){
        this.options.output = value
        // 如果不在输出列表中，则需要禁用
        for(const [name,transport] of Object.entries(this.transports)){
            transport.enabled = this.options.output.includes(name)
        }
    }
    get transports() { return this.#transportInstances; }
    /**
    * 部署安装后端实例
    */
    use<T extends TransportBase=TransportBase>(name:string,transportInstance:T){
        transportInstance._bind(this)
        this.#transportInstances[name] =  transportInstance
    }      
    /**
     * 将缓冲区的日志输出到存储
     */
    async flush(){ 
        await Promise.allSettled(Object.values(this.#transportInstances).map(transport=>transport.flush() ))
    }    
    /**
     * 捕获全局错误,自动添加到日志中
    */
    private catchGlobalErrors() {
        if(!this.options.catchGlobalErrors) return 
        let self:VoerkaLogger = this;
        safeCall(() => {
            window.onerror = function (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error): any{
                self.error(String(event), error);
            }
        })  
        safeCall(()=>{
            window.addEventListener('unhandledrejection', function(event:PromiseRejectionEvent) {
                self.error(`Unhandled promise rejection: ${event.reason}`);
                event.preventDefault();
            });            
        })
        safeCall(()=>{
            process.on('unhandledRejection', function (reason, promise) { 
                self.error(`Unhandled promise rejection at: ${promise},reason:${reason}`);
            })
        })
        safeCall(()=>{
            process.on("uncaughtException",function(error:any){
                self.error(error.stack);
            })             
        })
    }
    /**
     * 输出日志
     * @param {*}  
     */
    log(message:LogMethodMessage,vars:LogMethodVars={},options:LogMethodOptions={}) {  
        const msg = typeof(message)=='function' ? message() : message
        let record:VoerkaLoggerRecord =Object.assign({},this.options.context, {
            level:options.level, 
            timestamp:Date.now(),
            message:msg,
            ...this.options.scope || {},
            ...options
        })            
        if(record.error instanceof Error){
            const err = record.error as Error
            record.error = err.message
            record.errorStack = err.stack
            record.errorLine = err.stack
        }
        Object.values(this.#transportInstances).forEach((transportInst) => {
            const limitLevel = transportInst.level || this.options.level
            if (transportInst.enabled && (record.level >= limitLevel || limitLevel === VoerkaLoggerLevel.NOTSET || this.options.debug)) {                        
                try{
                    transportInst._output(Object.assign({},record),vars)
                }catch{

                }
            }
        })
    }
    /**
     *  
     *  logger.debug(message,{插值变量},{tags,module,error})
     *  logger.debug(message,[位置变量,位置变量,位置变量,...],{tags,module,error,...}) 
     *  如果变量或message是函数会自动调用
     */
    debug(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this.#rootScope?.debug(message,vars,options);
    }
    info(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions){
        this.#rootScope?.info(message,vars,options);
    }
    warn(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions){
        this.#rootScope?.warn(message,vars,options);
    }
    error(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this.#rootScope?.error(message,vars,options);
    }
    fatal(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this.#rootScope?.fatal(message,vars,options);
    }  

    async destory(){
        Object.values(this.#transportInstances).forEach(instance=>{
            instance.destroy()
        })
    }
    /**
     * 创建一个日志作用域
     * 
     * let log = logger.createScope({module:xxx})
     * 
     * @returns 
     */
     createScope(options:LoggerScopeOptions):VoerkaLoggerScope{
        return new VoerkaLoggerScope(this,options)
    }
}
 
 

export * from "./consts"


 