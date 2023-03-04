import { assignObject, omit } from "flex-tools";
import { type VoerkaLogger, VoerkaLoggerLevel } from "./Logger";
import { LogMethodMessage, LogMethodOptions, LogMethodVars, VoerkaLoggerRecord } from "./types";



export type LoggerScopeOptions = {
    scope: string     
} & {[key: string]: string | number | boolean}


export class VoerkaLoggerScope{
    #options: LoggerScopeOptions
    #logger: VoerkaLogger;
    constructor(logger:VoerkaLogger, options:LoggerScopeOptions){
        this.#logger = logger;
        this.#options = assignObject({},options)
    }
    get logger(){return this.#logger} 
    private log(message:LogMethodMessage,vars:LogMethodVars={},options:LogMethodOptions={}){
        const logger = this.logger
        if (!logger.options.enabled) return
        const msg = typeof(message)=='function' ? message() : message
        let record:VoerkaLoggerRecord =Object.assign({},logger.options.context, {
            level:options.level,
            scope:this.#options.scope,
            timestamp:Date.now(),
            message:msg,
            ...options
        })            
        if(record.error instanceof Error){
            const err = record.error as Error
            record.error = err.message
            record.errorStack = err.stack
            record.errorLine = err.stack
        }
        Object.values(logger.backends).forEach((backendInst) => {
            const limitLevel = backendInst.level || logger.options.level
            if (backendInst.enabled && (record.level >= limitLevel || limitLevel === VoerkaLoggerLevel.NOTSET || logger.options.debug)) {                        
                try{
                    backendInst._output(record,vars)
                }catch{

                }
            }
        })

        // // --------------
        // this.logger.log.call(this.logger,message,vars,Object.assign({},options, {
        //     scope:this.#options.scope,
        //     ...omit(this.#options,["scope"])
        // }));
    }
    /**
     *  
     *  logger.debug(message,{插值变量},{tags,module,error})
     *  logger.debug(message,[位置变量,位置变量,位置变量,...],{tags,module,error,...}) 
     *  如果变量或message是函数会自动调用
     */
    debug(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this.log(message,vars,{...options,level:VoerkaLoggerLevel.DEBUG});
    }
    info(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions){
        this.log(message,vars,{...options,level:VoerkaLoggerLevel.INFO});
    }
    warn(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions){
        this.log(message,vars,{...options,level:VoerkaLoggerLevel.WARN});
    }
    error(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this.log(message,vars,{...options,level:VoerkaLoggerLevel.ERROR});
    }
    fatal(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this.log(message,vars,{...options,level:VoerkaLoggerLevel.FATAL});
    }   
    /**
     * 创建子作用域
     * @param options 
     * @returns 
     */
    createScope(options:LoggerScopeOptions):VoerkaLoggerScope{
        const scope =this.#options.scope ?  `${this.#options.scope}${this.logger.options.scopeDelimiter}${options.scope}` : options.scope
        return new VoerkaLoggerScope(this.logger,{
            scope,            
            ...omit(this.#options,["scope"])
        });
    } 
    
}

