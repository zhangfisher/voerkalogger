/**
 * 日志
 *       logger.level=0       取值0-5
 *
 *          0 : NOTSET	    不输出,enable=false即level=0
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
import { DefaultLoggerOptions, VoerkaLoggerLevel, VoerkaLoggerLevelName, VoerkaLoggerLevelNames } from './consts';
import { safeCall, normalizeLevel } from './utils';
import {TransportBase} from "./transport";
import { VoerkaLoggerConstructorOptions, LogMethodOptions, LogMethodVars, VoerkaLoggerRecord, LogMethodMessage,VoerkaLoggerOptions } from './types';
import ConsoleTransport from "./console";
import { DeepRequired } from "ts-essentials"  
import { VoerkaLoggerScope, VoerkaLoggerScopeOptions } from "./scope";
import { assignObject } from "flex-tools/object/assignObject";
import { isPlainObject } from 'flex-tools/typecheck/isPlainObject';



export class VoerkaLogger{
    static LoggerInstance:VoerkaLogger;
    private _transportInstances:Record<string,TransportBase>={}                     // 后端实例
    private _options:VoerkaLoggerOptions =  DefaultLoggerOptions as VoerkaLoggerOptions
    _rootScope?:VoerkaLoggerScope
    // 用来当enable=false时缓存日志,当enable=true时输出  [[record,vars],...]
    #cache:[any,any][] =[]        
    constructor(options?:VoerkaLoggerConstructorOptions) {
        if(VoerkaLogger.LoggerInstance){
            return VoerkaLogger.LoggerInstance
        } 
        this.updateOptions(options)        
        // 注册默认的控制台日志输出
        this.use("console",new ConsoleTransport() as unknown as TransportBase)
        // 注入全局日志实例
        if(this.options.injectGlobal){
            (globalThis as any)[this.options.injectGlobal===true ? "logger" : this.options.injectGlobal] = this
        }
        // 捕获全局错误,自动添加到日志中
        this.catchGlobalErrors();
        VoerkaLogger.LoggerInstance = this              
        this._rootScope = new VoerkaLoggerScope(this,this.options.scope)  
    }    
    get options():VoerkaLoggerOptions {return this._options!}    
    set options(value:VoerkaLoggerConstructorOptions) { 
        Object.entries(this._transportInstances).forEach(([name,transport])=>{
            if((name in value) && isPlainObject(value[name])){
                transport.options = value[name] as any  // 该操作是局部更新
                delete value[name]
            }
        })
        this.updateOptions(value)
    }
    get enable() { return this.options.enable; }
    set enable(value) { 
        this.options.enable = value; 
        // 如果enable=true,则输出缓冲区的日志
        if(value && this.#cache.length>0){
            this.#cache.forEach(([record,vars])=>this.outputToTransports(record,vars,{excludes:["console"]}))
            this.#cache = [] 
        }
    }
    get levelName(){ return VoerkaLoggerLevelNames[this.options.level]}
    get level() { return this.options.level as VoerkaLoggerLevel; }    
    set level(value:VoerkaLoggerLevel | VoerkaLoggerLevelName) {this.options.level = normalizeLevel(value)}     
    get cache() { return this.#cache; }
    get output() { return this.options.output  }   
    set output(value:string[]){
        this.options.output = value
        // 如果不在输出列表中，则需要禁用
        for(const [name,transport] of Object.entries(this.transports)){
            transport.enable = this.options.output.includes(name)
        }
    }
    get transports() { return this._transportInstances; }

    private updateOptions(value?:VoerkaLoggerConstructorOptions){
        let options = assignObject(DefaultLoggerOptions,value) as DeepRequired<VoerkaLoggerOptions> 
        if(typeof(options.output)=='string') options.output = options.output.split(",")
        options.level = normalizeLevel(options.level)
        Object.assign(this._options,options)
    }
    /**
    * 部署安装后端实例
    */
    use<T extends TransportBase=TransportBase>(name:string,transportInstance:T){
        transportInstance._bind(this)     
        this._transportInstances[name] =  transportInstance
    }      
    /**
     * 将缓冲区的日志输出到存储
     */
    async flush(){ 
        await Promise.allSettled(Object.values(this._transportInstances).map(transport=>transport.flush() ))
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
     *  输出日志到各个transports
     * @param record 
     * @param vars 
     * @param exclude 排除输出的transport名称
     */
    private outputToTransports(record:VoerkaLoggerRecord,vars:any,{includes=[],excludes=[]}:{includes?:string[],excludes?:string[]}){
        if(includes && includes.length==0){
            includes= Object.keys(this._transportInstances)        
        } 
        if(excludes && excludes.length>0){
            includes = includes.filter(name=>!excludes.includes(name))
        }
        includes.forEach((name) => {            
            if(!(name in this._transportInstances)) return         // 以!开头的transport不输出
            const transport = this._transportInstances[name]
            if ((record.level >= this.options.level || record.level==VoerkaLoggerLevel.NOTSET || this.options.debug)) {                        
                try{
                    transport._output(Object.assign({},record),vars)
                }catch(e:any){
                    console.error(`VoerkaLogger:transport ${name} output error`,e)
                }
            }
        })
    }
    /**
     * 输出日志
     * @param {*}  
     */
    log(message:LogMethodMessage,vars:LogMethodVars={},options:LogMethodOptions={},transports:string[]=[]) {  
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
        // 如果enable=false,则缓存日志，在此进行缓存，这样可以保证后续添加的transport也能输出
        // 当enable=true时，再将缓存的日志输出到transport
        if(!this.enable){
            if(this.#cache.length>this.options.bufferSize){
                this.#cache.shift()
            }
            this.#cache.push([record,vars])
            // 如果此时console.enable=true,则输出
            this.outputToTransports(record,vars,{includes:['console']})
            return
        }                
        this.outputToTransports(record,vars,{includes:transports})
    }
    /**
     *  
     *  logger.debug(message,{插值变量},{tags,module,error})
     *  logger.debug(message,[位置变量,位置变量,位置变量,...],{tags,module,error,...}) 
     *  如果变量或message是函数会自动调用
     */
    debug(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this._rootScope?.debug(message,vars,options);
    }
    info(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions){
        this._rootScope?.info(message,vars,options);
    }
    warn(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions){
        this._rootScope?.warn(message,vars,options);
    }
    error(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this._rootScope?.error(message,vars,options);
    }
    fatal(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this._rootScope?.fatal(message,vars,options);
    }  

    async destory(){
        await Promise.allSettled(Object.values(this._transportInstances).map(instance=>instance.destroy()))
    }
    /**
     * 创建一个日志作用域
     * 
     * let log = logger.createScope({module:xxx})
     * 
     * @returns 
     */
     createScope(options:VoerkaLoggerScopeOptions):VoerkaLoggerScope{
        return new VoerkaLoggerScope(this,options)
    }
}
 