/**
 * 
 * 支持控制台着色输出的日志传输器
 * 
 */ 
import { TransportBaseOptions,TransportBase, TransportOptions } from '@VoerkaLogger/core';
import {  LogMethodVars,  VoerkaLoggerRecord } from "@VoerkaLogger/core"
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

export interface ConsoleTransportOptions extends TransportBaseOptions<void>{
     
}


export default class ConsoleTransport extends TransportBase<ConsoleTransportOptions>{     
    constructor(options?:TransportOptions<ConsoleTransportOptions>){
        super(assignObject({      
            bufferSize:0,       // 控制台输出时不需要缓冲区  
            format:"[{levelName}] - {datetime} : {message}{<,module=>module}{<,tags=>tags}"    
        },options))
        logsets.config({
            String:"lightGreen"
        })
    }
    /**
     * 控制台输出时不进行缓冲，所以需要立刻输出
     * @param record 
     * @param interpVars 
     */
    format(record: VoerkaLoggerRecord,interpVars:LogMethodVars){      
        const { format } = this.options
        try{         
            const template = typeof(format) == 'function'  ? format.call(this, record, interpVars) as unknown as string : format
            record.message = logsets.getColorizedTemplate(record.message,interpVars)
            const vars ={
                ...this.getInterpVars(record),
                ...record,
            }
            const output = template!.params(vars)
            const levelColorizer = logsets.getColorizer(logLevelColors[record.level])
            const coloredOutput = levelColorizer(logsets.getColorizedTemplate(output,vars))
            console.log(coloredOutput) 
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