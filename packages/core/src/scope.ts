import { assignObject, omit } from "flex-tools/object";
import { type VoerkaLogger, VoerkaLoggerLevel } from "./Logger";
import { LogMethodMessage, LogMethodOptions, LogMethodVars, VoerkaLoggerRecord } from "./types";



export type LoggerScopeOptions = {
    module: string     
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
        const msg = typeof(message)=='function' ? message() : message
        let record:VoerkaLoggerRecord =assignObject({},logger.options.context, {
            level:options.level,
            timestamp:Date.now(),
            message:msg,
            ...logger.options.scope || {},
            ...options,
            ...this.#options
        })            
        if(record.error instanceof Error){
            const err = record.error as Error
            record.error = err.message
            record.errorStack = err.stack
            record.errorLine = err.stack
        }
        Object.values(logger.transports).forEach((transportInst) => {
            const limitLevel = transportInst.level || logger.options.level
            if (transportInst.enabled && (record.level >= limitLevel || limitLevel === VoerkaLoggerLevel.NOTSET || logger.options.debug)) {                        
                try{
                    transportInst._output(record,vars)
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
        const module =this.#options.module ?  `${this.#options.module}/${options.module}` : options.module
        return new VoerkaLoggerScope(this.logger,{
            module,            
            ...omit(this.#options,["module"])
        });
    } 
    
}

