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
import { colorize } from './utils';
import ansicolor from "ansicolor"
import { isNumber } from 'flex-tools/typecheck/isNumber';

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
function inBrowser(){
    try{
        return typeof window !== 'undefined' && typeof window.document !== 'undefined'
    }catch{
        return false
    }    
}
export default class ConsoleTransport extends TransportBase<ConsoleTransportOptions>{     
    constructor(options?:TransportOptions<ConsoleTransportOptions>){
        super(assignObject({
            bufferSize:0,     
            format:"[{levelName}] - {datetime} : {message}{<,module=>module}{<,tags=>tags}"    
        },options)) 
    }
    format(record: VoerkaLoggerRecord,interpVars:LogMethodVars):void{      
        const { format } = this.options
        let  isBrowser = inBrowser()
        try{         
            const template = typeof(format) == 'function'  ? format.call(this, record, interpVars) as unknown as string : format           
            if(isBrowser){
                record.message = record.message.params(interpVars)            
            }else{
                record.message = record.message.params(interpVars,{
                    $forEach:(name:string,value:string,prefix:string,suffix:string):[string,string,string ]=>{
                        const varType = isNumber(value) ? 'number' : ( value === 'true' || value === 'false' ? 'boolean' : 'string')
                        if(varType=='number'){
                            value = ansicolor.yellow(value)
                        }else if(varType=='string'){
                            value = ansicolor.green(value)
                        }else if(varType=='boolean'){
                            value = ansicolor.cyan(value)
                        }
                        return [prefix,value,suffix]            
                    }})            
            }
            
            const vars ={
                ...this.getInterpVars(record),
                ...record,
            }            
            let output = template!.params(vars)    

            const level = record.level 
            // 在浏览器端采用console输出
            if(isBrowser){
                const logMethod =record.level < 0 && record.level > consoleMethods.length ?  consoleMethods[record.level]  : consoleMethods[record.level] 
                logMethod(output.params(vars))  
            }else{// 在node端采用ansicolor着色输出
                if(level==5){   // fatal
                    output =ansicolor.lightRed(output)
                }else if(level==4){ // error
                    output =ansicolor.red(output)
                }else if(level==3){ // warn
                    output = ansicolor.yellow(output)
                }else if(level==2){ // info
                }else{             // debug
                    output = ansicolor.darkGray(output)
                }
                console.log(output)
            }     
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