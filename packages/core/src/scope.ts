import { assignObject, omit } from "flex-tools/object";
import { type VoerkaLogger } from "./Logger";
import { LogMethodMessage, LogMethodOptions, LogMethodVars } from "./types";
import {  VoerkaLoggerLevel } from "./consts";


/**
 * 用来标识日志的作用域信息
 */
export interface VoerkaLoggerScopeOptions{
    version?: string                                    // 设备或应用软件版本号   
    app?: string                                        // 应用名称
    module?: string                                     // 模块名称
    func?: string                                       // 函数名称
    lineno?: number                                     // 行号
    host?: string                                       // 当前主机名称，如IP地址或
    sn?: string                                         // 设备序列号
    [key: string]: string | number | boolean | undefined
}
export type VoerkaLoggerRootScopeOptions = Omit<VoerkaLoggerScopeOptions,'module' | 'func' | 'lineno'>


export class VoerkaLoggerScope{
    #options: VoerkaLoggerScopeOptions
    #logger: VoerkaLogger;
    constructor(logger:VoerkaLogger, options:VoerkaLoggerScopeOptions){
        this.#logger = logger;
        this.#options = assignObject({},options)
    }
    get logger(){return this.#logger} 
    /**
     *  
     *  logger.debug(message,{插值变量},{tags,module,error})
     *  logger.debug(message,[位置变量,位置变量,位置变量,...],{tags,module,error,...}) 
     *  如果变量或message是函数会自动调用
     */
    debug(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this.logger.log(message,vars,{...this.#options,...options,level:VoerkaLoggerLevel.DEBUG});
    }
    info(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions){
        this.logger.log(message,vars,{...this.#options,...options,level:VoerkaLoggerLevel.INFO});
    }
    warn(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions){
        this.logger.log(message,vars,{...this.#options,...options,level:VoerkaLoggerLevel.WARN});
    }
    error(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this.logger.log(message,vars,{...this.#options,...options,level:VoerkaLoggerLevel.ERROR});
    }
    fatal(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        this.logger.log(message,vars,{...this.#options,...options,level:VoerkaLoggerLevel.FATAL});
    }   
    /**
     * 创建子作用域
     * @param options 
     * @returns 
     */
    createScope(options:VoerkaLoggerScopeOptions):VoerkaLoggerScope{
        const module =this.#options.module ?  `${this.#options.module}/${options.module}` : options.module
        return new VoerkaLoggerScope(this.logger,{
            module,            
            ...omit(this.#options,["module"])
        });
    }     
}

