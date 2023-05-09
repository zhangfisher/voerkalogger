/**
 * 
 * 默认的控制台输出
 * 不支持着色输出
 * 
 
 * 
 */
import { TransportBaseOptions,TransportBase, TransportOptions } from './transport';
import {  LogMethodVars,  VoerkaLoggerRecord } from "./types"
import { assignObject } from 'flex-tools/object/assignObject';
import chalk from "chalk"
import { colorize } from './utils';

const consoleMethods=[
    console.log,
	console.debug,
	console.info,
	console.warn,
	console.error,
    console.error
]

export interface ConsoleTransportOptions extends TransportBaseOptions<void>{
     
}

export default class ConsoleTransport extends TransportBase<ConsoleTransportOptions>{     
    constructor(options?:TransportOptions<ConsoleTransportOptions>){
        super(assignObject({
            // 关闭缓冲区，控制台输出不需要启用异步输出
            bufferSize:0,     
            format:"[{levelName}] - {datetime} : {message}{<,module=>module}{<,tags=>tags}"    
        },options)) 
    }
    format(record: VoerkaLoggerRecord,interpVars:LogMethodVars):void{      
        const { format } = this.options
        try{         
            const template = typeof(format) == 'function'  ? format.call(this, record, interpVars) as unknown as string : format           
            record.message = record.message.params(interpVars)            
            const vars ={
                ...this.getInterpVars(record),
                ...record,
            }            
            let output = template!.params(vars)    

            const level = record.level 
            if(level==5){   // fatal
                output =colorize(output,'brightRed')
            }else if(level==4){ // error
                output =colorize(output,'red')
            }else if(level==3){ // warn
                output = colorize(output,'yellow')
            }else if(level==2){ // info
                output = colorize(output,'white')
            }else{             // debug
                output = colorize(output,'darkGray')
            }
            console.log(output)
            return
            const logMethod =record.level < 0 && record.level > consoleMethods.length ?  consoleMethods[record.level]  : consoleMethods[record.level] 
            logMethod(output.params(vars))      
                  
        }catch(e:any){   
            console.error(e.stack)
        }        
    }    
    /**
     * 清除所有存储的日志
     */
    async clear(){
        console.clear()
    }  
}