/**
 * this指向实现Logger实例
 
 * 
 */
import { BackendBaseOptions,BackendBase } from '../../BackendBase';
import {  LogMethodVars,  VoerkaLoggerRecord } from "../../types"
import logsets from "logsets" 
import { assignObject } from 'flex-tools';

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
        super(assignObject({
            // 关闭缓冲区，控制台输出不需要启用异步输出
            bufferSize:0,               
            // format:"[{levelName}] - {datetime} : {message}{<,module=>module}{<,tags=>tags}"    
        },options))
        logsets.config({
            String:"lightGreen"
        })
    }
    format(record: VoerkaLoggerRecord,interpVars:LogMethodVars):void{      
        try{         
            const colorizedRecord = Object.assign({},record)
            const template = typeof(this.options.format) == 'function'  ? this.options.format.call(this, colorizedRecord, interpVars, this) as unknown as string : this.options.format
            const levelColorizer = logsets.getColorizer(logLevelColors[colorizedRecord.level])
            colorizedRecord.message = logsets.getColorizedTemplate(colorizedRecord.message,interpVars)
            const vars ={
                ...this.getInterpVars(colorizedRecord),
                ...colorizedRecord,
            }
            const output = template!.params(vars)
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