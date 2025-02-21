import localForage from 'localforage';
import { TransportBaseOptions,TransportBase, TransportOptions, DefaultFormatTemplate, LogMethodVars,  VoerkaLoggerRecord } from '@voerkalogger/core';
import { assignObject } from 'flex-tools/object/assignObject';
import ansicolor from "ansicolor"
import { isNumber } from 'flex-tools/typecheck/isNumber';
import {isNothing} from 'flex-tools/typecheck/isNothing'
import { isTest } from "std-env"; 
export interface ColorizedConsoleTransportOptions extends TransportBaseOptions<void>{
     // 可以在这里添加一些特定的选项，例如存储库的名称等
    storageName?: string;
} 
//存储库
// localforage
export default class IndexDbTransport extends TransportBase<ColorizedConsoleTransportOptions>{
    constructor(options?:TransportOptions<ColorizedConsoleTransportOptions>){
        super(assignObject({
            bufferSize:0,     
            format:DefaultFormatTemplate,
            storageName: 'voerka' // 默认存储库名称
        },options)) 
        // 初始化 localForage
        localForage.config({
            name: this.options.storageName,
            storeName: 'logs' // 存储日志的 store 名称
        });
    }
    //格式化日志
    format(record: VoerkaLoggerRecord,interpVars:LogMethodVars):void{
        if(isTest) return               // 测试阶段不保存到库中
        const { format } = this.options
        try{         
            const template = typeof(format) == 'function'  ? format.call(this, record, interpVars) as unknown as string : format 
            record.message = record.message.params(interpVars,{
                $forEach:(name:string,value:string,prefix:string,suffix:string)=>{
                    // const varType = isNumber(value) ? 'number' : ( value === 'true' || value === 'false' ? 'boolean' : 'string')
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
            let levelName = "INFO";
            if(level==5){   // fatal
                levelName = "FATAL";
            }else if(level==4){ // error
                levelName = "ERROR";
            }else if(level==3){ // warn
                levelName = "WARN";
            }else if(level==2){ // info
                levelName = "INFO";
            }else{             // debug
                levelName = "DEBUG";
            }
            // 将格式化后的日志存储到指定库中
            localForage.setItem(`${new Date().toISOString()}`, output).catch((err: any) => {
                console.error("日志输出到 indexdb, 但失败,原因为: ", err);
            });
        }catch(e:any){   
            console.error("日志输出到 indexdb,但失败,原因为: " , e.stack)
        }        
    }
    //清空日志
    async clear(){
         // 清空 localForage 中的日志
         localForage.clear().catch((err:any) => {
            console.error('清空 localForage 日志失败', err);
        });
    }
}
