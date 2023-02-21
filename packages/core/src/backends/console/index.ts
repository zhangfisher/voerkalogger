/**
 * this指向实现Logger实例
 
 * 
 */
import { BackendBase } from '../../BackendBase';
import { BackendBaseOptions,  LogMethodVars,  VoerkaLoggerRecord } from "../../types"
import logsets from "logsets"
import { VoerkaLoggerLevel } from '../../consts';


const logLevelColors = [
    "lightGray",                            // NOSET
    "lightGray",                            // DEBUG
    "dim",                                  // INFO
    "yellow",                               // WARN
    "red",                                  // ERROR
    "red,dim"                               // FA
]


function colorizeLog(level:VoerkaLoggerLevel,template: string,vars:any){
    // 先做插值处理
    let result = template.params(vars,{
        
    })

    
}

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

export type ConsoleBackendOutput = [string,string]

export default class ConsoleBackend extends BackendBase<ConsoleBackendOptions,ConsoleBackendOutput>{     
    constructor(options?:ConsoleBackendOptions){
        super(Object.assign({
            format:"[{levelName}] - {datetime} : {message}{<,>module}{<,>tags}"    
        },options))
    }
    async format(record: VoerkaLoggerRecord,interpVars:LogMethodVars):Promise<ConsoleBackendOutput>{                
        return [this.options.format as string,interpVars]
    }
    // 负责输出日志内容
    async output(result:ConsoleBackendOutput,record:VoerkaLoggerRecord){
        // 进行单元测试时不在 console 中输出
        try{
            if(process.env.NODE_ENV === "test") return 
        }catch{
            return
        }
        try{ 
            consoleMethods[record.level](result[0].params(result[1]))
            //logsets.log(result[0],result[1] as any)
        }catch(e:any){   
            console.log(e.stack)
        }         
    } 
}