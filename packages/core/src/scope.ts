import { assignObject, omit } from "flex-tools/object";
import { type VoerkaLogger } from "./Logger";
import { LogMethodMessage, LogMethodOptions, LogMethodVars } from "./types";
import { VoerkaLoggerLevel, VoerkaLoggerLevelName } from './consts';
import { normalizeLevel } from './utils';


/**
 * 用来标识日志的作用域信息
 */
export interface VoerkaLoggerScopeOptions{
    level?: VoerkaLoggerLevel | VoerkaLoggerLevelName       // 日志级别
    version?: string                                        // 设备或应用软件版本号   
    app?: string                                            // 应用名称
    module?: string                                         // 模块名称
    func?: string                                           // 函数名称
    lineno?: number                                         // 行号
    host?: string                                           // 当前主机名称，如IP地址或
    sn?: string                                             // 设备序列号
    [key: string]: string | number | boolean | undefined
}
export type VoerkaLoggerRootScopeOptions = Omit<VoerkaLoggerScopeOptions,'module' | 'func' | 'lineno'>


export class VoerkaLoggerScope{
    private _options: VoerkaLoggerScopeOptions
    private _logger: VoerkaLogger;
    constructor(logger:VoerkaLogger, options:VoerkaLoggerScopeOptions){
        this._logger = logger;
        this._options = assignObject({},options)
        if(this._options.level){
            this._options.level = normalizeLevel(this._options.level as any)
        }        
    }
    get logger(){return this._logger} 
    get level(){return this._options.level}
    /**
     *  
     *  logger.debug(message,{插值变量},{tags,module,error})
     *  logger.debug(message,[位置变量,位置变量,位置变量,...],{tags,module,error,...}) 
     *  如果变量或message是函数会自动调用
     */
    debug(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        if(this.level==undefined ||  (this.level && this.level>=VoerkaLoggerLevel.DEBUG)){
            this.logger.log(message,vars,{...this._options,...options,level:VoerkaLoggerLevel.DEBUG});
        }        
    }
    info(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions){
        if(this.level==undefined ||  (this.level && this.level>=VoerkaLoggerLevel.INFO)){
            this.logger.log(message,vars,{...this._options,...options,level:VoerkaLoggerLevel.INFO});
        }
    }
    warn(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions){
        if(this.level==undefined ||  (this.level && this.level>=VoerkaLoggerLevel.WARN)){
            this.logger.log(message,vars,{...this._options,...options,level:VoerkaLoggerLevel.WARN});
        }
    }
    error(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        if(this.level==undefined ||  (this.level && this.level>=VoerkaLoggerLevel.ERROR)){
            this.logger.log(message,vars,{...this._options,...options,level:VoerkaLoggerLevel.ERROR});
        }
    }
    fatal(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions) {
        if(this.level==undefined ||  (this.level && this.level>=VoerkaLoggerLevel.FATAL)){
            this.logger.log(message,vars,{...this._options,...options,level:VoerkaLoggerLevel.FATAL});
        }
    }   
    /**
     * 创建子作用域
     * @param options 
     * @returns 
     */
    createScope(options:VoerkaLoggerScopeOptions):VoerkaLoggerScope{
        const module =this._options.module ?  `${this._options.module}/${options.module}` : options.module
        return new VoerkaLoggerScope(this.logger,{
            module,                        
            ...omit(this._options,["module"])
        });
    }     
}

