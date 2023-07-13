/**
 * 
 * 默认的控制台输出
 * 不支持着色输出
 * 
 
 * 
 */
import { TransportBaseOptions,TransportBase, TransportOptions, DefaultFormatTemplate, LogMethodVars,  VoerkaLoggerRecord } from '@voerkalogger/core';
import { assignObject } from 'flex-tools/object/assignObject';
import ansicolor from "ansicolor"
import { isNumber } from 'flex-tools/typecheck/isNumber';
import {isNothing} from 'flex-tools/typecheck/isNothing'

 
export interface ColorizedConsoleTransportOptions extends TransportBaseOptions<void>{
     
} 

export default class ColorizedConsoleTransport extends TransportBase<ColorizedConsoleTransportOptions>{     
    constructor(options?:TransportOptions<ColorizedConsoleTransportOptions>){
        super(assignObject({
            bufferSize:0,     
            format:DefaultFormatTemplate
        },options)) 
    }
    format(record: VoerkaLoggerRecord,interpVars:LogMethodVars):void{      
        const { format } = this.options
        try{         
            const template = typeof(format) == 'function'  ? format.call(this, record, interpVars) as unknown as string : format           

            record.message = record.message.params(interpVars,{
                $forEach:(name:string,value:string,prefix:string,suffix:string)=>{
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
            
            const vars:Record<string,any> = {
                ...this.getInterpVars(record),
                ...record,
            }       

            let output = template!.params(vars,{
                $forEach:(name:string,value:string,prefix:string,suffix:string)=>{
                    if(name.includes("/")){
                        const varnames = name.split("/")
                        // 如果所有的变量都是空的，则返回
                        const isEmpty = varnames.every((name:string)=>isNothing(name in vars ? vars[name] : null))
                        if(isEmpty){
                            return null
                        }else{
                            value = varnames.map((name:string)=>{
                               return vars[name] = vars[name] || ""
                            }).filter(v=>String(v).length>0).join("/")
                            return [ansicolor.darkGray(prefix),ansicolor.darkGray(value),ansicolor.darkGray(suffix)]
                        }
                    }
                }
            })    

            const level = record.level 
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