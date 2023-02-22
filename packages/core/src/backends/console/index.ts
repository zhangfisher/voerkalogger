/**
 * this指向实现Logger实例
 
 * 
 */
import { BackendBase } from '../../BackendBase';
import { BackendBaseOptions,  LogMethodVars,  VoerkaLoggerRecord } from "../../types"
import logsets from "logsets"
import { VoerkaLoggerLevel } from '../../consts';
import { getInterpolatedVars } from '../../utils';


const logLevelColors = [
    "darkGray",                             // NOSET
    "darkGray",                             // DEBUG
    "lightGray",                            // INFO
    "yellow",                               // WARN
    "red",                                  // ERROR
    "red,bright"                            // FATAL
]

 
const consoleMethods=[
    logsets.log,
	logsets.debug,
	logsets.info,
	logsets.warn,
	logsets.error,
    logsets.error
]

export interface ConsoleBackendOptions extends BackendBaseOptions{
    
}


export default class ConsoleBackend extends BackendBase<ConsoleBackendOptions,void>{     
    constructor(options?:ConsoleBackendOptions){
        super(Object.assign({
            format:"[{levelName}] - {datetime} : {message}{<,>module}{<,>tags}"    
        },options))
    }
    format(record: VoerkaLoggerRecord,interpVars:LogMethodVars):void{      
        const template = typeof(this.options.format) == 'function'  ? this.options.format.call(this, record, interpVars, this) as unknown as string : this.options.format
        let vars          
        // 如果只有位置插值，则代表插值只对message进行，否则就会出现插值不匹配的情况
        if(Array.isArray(interpVars)){
            vars ={
                ...this.getInterpVars(record,{}),
                message: record.message.params(interpVars)
            }
        }else{
            vars = interpVars
        }   
        try{ 
            const output = template!.params(vars)
            const levelColorizer = logsets.getColorizer(logLevelColors[record.level])
            return console.log(levelColorizer(logsets.getColorizedTemplate(output,vars)))
        }catch(e:any){   
            console.log(e.stack)
        }        
    }    
    /**
     * 清除所有存储的日志
     */
    async clear(){
        console.clear()
    }  
}