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
import { handleLogArgs, safeCall } from "./utils";
import {BackendBase} from "./BackendBase";
import { VoerkaLoggerOptions, LogMethodOptions, LogMethodVars, VoerkaLoggerRecord } from "./types";
import ConsoleBackend from "./backends/console";
import { BatchBackendBase } from "./BatchBackendBase";
import { DeepRequired } from "ts-essentials"  




export class VoerkaLogger{
    static LoggerInstance:VoerkaLogger;
    #backendInstances:Record<string,BackendBase>={}                     // 后端实例
    #options?:DeepRequired<VoerkaLoggerOptions> 
    constructor(options?:VoerkaLoggerOptions) {
        if(VoerkaLogger.LoggerInstance){
            return VoerkaLogger.LoggerInstance
        } 
        this.#options = Object.assign(DefaultLoggerOptions,options || {}) as DeepRequired<VoerkaLoggerOptions>  

        // 注册默认的控制台日志输出
        this.use("console",(new ConsoleBackend()) as unknown as BackendBase)
        // 捕获全局错误,自动添加到日志中
        this.catchGlobalErrors();
        VoerkaLogger.LoggerInstance = this        
    }    
    get options() {return this.#options!}
    get enabled() { return this.options.enabled; }
    set enabled(value) { this.options.enabled = value; }
    get level() { return this.options.level }
    set level(value:VoerkaLoggerLevel) {this.options.level = value;} 
    get output() { return this.options.output  }   
    set output(value:string[]){
        this.options.output = value
        // 如果不在输出列表中，则需要禁用
        for(const [name,backend] of Object.entries(this.backends)){
            backend.enabled = this.options.output.includes(name)
        }
    }
    get backends() { return this.#backendInstances; }
    /**
    * 部署安装后端实例
    */
    use(name:string,backendInstance:BackendBase){
        backendInstance._bind(this)
        this.#backendInstances[name] =  backendInstance
    }      
    /**
     * 将缓冲区的日志输出到存储
     */
    async flush(){ 
        await Promise.allSettled(Object.values(this.#backendInstances).map(backend=>{
            if(backend instanceof BatchBackendBase){
                backend.flush() 
            } 
        }))
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
    private _log(message:string | Function,vars:LogMethodVars={},options:LogMethodOptions={}) {  
        if (!this.options.enabled) return
        let record:VoerkaLoggerRecord =Object.assign({},this.options.context, handleLogArgs(message,vars,options))    
        Promise.allSettled(Object.values(this.#backendInstances).map((backendInst) => {
            const limitLevel = backendInst.level || this.options.level
            if (backendInst.enabled && (record.level >= limitLevel || limitLevel === VoerkaLoggerLevel.NOTSET || this.options.debug)) {                        
                backendInst._output(record);
            }
        }))
    }
    /**
     *  
     *  logger.debug(message,{插值变量},{tags,module})
     *  logger.debug(message,[位置变量,位置变量,位置变量,...],{tags,module,...}) 
     *  如果变量或message是函数会自动调用
     */
    debug(message:string | Function,vars?:LogMethodVars,options?:LogMethodOptions) {
        this._log(message,vars,Object.assign(options || {}, {level:VoerkaLoggerLevel.DEBUG}));
    }
    info(message:string | Function,vars?:LogMethodVars,options?:LogMethodOptions){
        this._log(message,vars,Object.assign(options || {}, {level:VoerkaLoggerLevel.INFO}));
    }
    warn(message:string | Function,vars?:LogMethodVars,options?:LogMethodOptions){
        this._log(message,vars,Object.assign(options || {}, {level:VoerkaLoggerLevel.WARN}));
    }
    error(message:string | Function,vars?:LogMethodVars,options?:LogMethodOptions) {
        this._log(message,vars,Object.assign(options || {}, {level:VoerkaLoggerLevel.ERROR}));
    }
    fatal(message:string | Function,vars?:LogMethodVars,options?:LogMethodOptions) {
        this._log(message,vars,Object.assign(options || {}, {level:VoerkaLoggerLevel.FATAL}));
    }  
}
 
 

export * from "./consts"


 