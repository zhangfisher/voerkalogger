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
import { DefaultLoggerOptions, LogLevel  } from "./consts" 
import { handleLogArgs } from "./utils";
import {BackendBase} from "./BackendBase";
import { LoggerOptions, LogMethodOptions, LogMethodVars, LogRecord } from "./types";
import ConsoleBackend from "./backends/console";
import { BatchBackendBase } from "./BatchBackendBase";
  

export class Logger{
    static LoggerInstance:Logger;
    #backendInstances:Record<string,BackendBase>={}
    #options:Required<LoggerOptions> = DefaultLoggerOptions
    constructor(options?:LoggerOptions) {
        if(Logger.LoggerInstance){
            return Logger.LoggerInstance
        } 
        Object.assign(this.#options,options)        
        this.loadOutputBackends();// 加载输出后端
        // 捕获全局错误,自动添加到日志中
        this.catchGlobalErrors();
        Logger.LoggerInstance = this        
    }    
    get options() {return this.#options}
    get enabled() { return this.#options.enabled; }
    set enabled(value) { this.#options.enabled = value; }
    get level() { return this.#options.level }
    set level(value:LogLevel) {this.#options.level = value;} 
    get output() { return this.#options.output }   
    get backends() { return this.#backendInstances; }
    
    /**
     * 安装后端实例
     */
    use(backend:BackendBase){

    }


    /**
     * 重置所有后端实例
     */
    private _resetBackends(){ 
         
    } 
    /**
     * 读取后端配置参数
     * @param name 
     * @returns 
     */
    private _getBackendOptions(name:string) {
        let options = {
            enabled:true,
            level:this.#options.level,
            format:this.#options.format
        };
        if (name in this.#options.backends) {
            Object.assign(options, this.#options.backends[name]);
        }
        return options
    }
    /**
     * 添加持久化后端实例
     */
    addBackend(name:string,backendInstance:BackendBase) {
        try {
            this.#backendInstances[name] = backendInstance;
            if (this.#options.debug) console.debug('Logger backend[{name}] is enabled'.params(name));
        } catch (e:any) {
            console.warn('Error on loading logger backend[{name}] : {error}'.params(name, e.message));
        }
    }
    removeBackend(name:string) {
        delete this.#backendInstances[name];
    }
    resetBackend(name:string) {
        if(!(name in this.#backendInstances)) return 
        let options = this._getBackendOptions(name) 
        this.#backendInstances[name].reset(options).catch(e=>console.error("重置日志后端时出错:",e.stack))
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
     * 获取启用的有效后端实例并保存在_backendInstances
     */
    private loadOutputBackends() {
        let output = this.#options.output.split(",");
        this.#backendInstances = {};
        // 当开启debug时自动启用控制台输出
        if (this.#options.debug && !output.includes('console')) output.push('console');
        // 构建配置的输出存储后端
        output.forEach((name:string) => {
            this.addBackend(name,this._createBackendInstance(name) );
        });
    }
    /**
     * 捕获全局错误,自动添加到日志中
    */
    private catchGlobalErrors() {
        if(!this.#options.catchGlobalErrors) return 
        let self:Logger = this;
       ;
        window.onerror = function (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error): any{
            self.error(String(event), error);
        };
        window.addEventListener('unhandledrejection', function(e:any) {
            self.error(String(e.stack || e.message || e));
        });
    }
    /**
     * 输出日志
     * @param {*}  
     */
    private _log(message:string | Function,vars:LogMethodVars={},options:LogMethodOptions={}) {  
        if (!this.#options.enabled) return
        let record =Object.assign({},this.#options.context, handleLogArgs(message,vars,options))    
        Promise.allSettled(Object.values(this.#backendInstances).map((backendInst) => {
            const limitLevel = backendInst.level || this.#options.level
            if (backendInst.enabled && (record.level >= limitLevel || limitLevel === LogLevel.NOTSET || this.#options.debug)) {                        
                return backendInst._output(record);
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
        this._log(message,vars,Object.assign(options || {}, {level:LogLevel.DEBUG}));
    }
    info(message:string | Function,vars?:LogMethodVars,options?:LogMethodOptions){
        this._log(message,vars,Object.assign(options || {}, {level:LogLevel.INFO}));
    }
    warn(message:string | Function,vars?:LogMethodVars,options?:LogMethodOptions){
        this._log(message,vars,Object.assign(options || {}, {level:LogLevel.WARN}));
    }
    error(message:string | Function,vars?:LogMethodVars,options?:LogMethodOptions) {
        this._log(message,vars,Object.assign(options || {}, {level:LogLevel.ERROR}));
    }
    fatal(message:string | Function,vars?:LogMethodVars,options?:LogMethodOptions) {
        this._log(message,vars,Object.assign(options || {}, {level:LogLevel.FATAL}));
    } 
    /**
     * 重置日志后端
     */
    reset() {
        this._resetBackends()
    }
}
 

export * from "./consts"
