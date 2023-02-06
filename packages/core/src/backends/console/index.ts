/**
 * this指向实现Logger实例
 
 * 
 */
import { BackendBase } from '../../BackendBase';
import { BackendBaseOptions, VoerkaLoggerRecord } from "../../types"

const consoleMethods=[
    console.log,
	console.debug,
	console.info,
	console.warn,
	console.error,
    console.error
]

export interface ConsoleBackendOptions extends BackendBaseOptions<string>{
    //format:"[{level}] - {datetime} : {message}{,tags}{,module}"    
}

 
export default class ConsoleBackend extends BackendBase<ConsoleBackendOptions,string>{ 
    async format(record: VoerkaLoggerRecord){
        return ""
    }
    // 负责输出日志内容
    async output(result:string,record:VoerkaLoggerRecord){
        // 进行单元测试时不在 console 中输出
        if(process.env.NODE_ENV === "test") return 
        try{
            let consoleOutput = consoleMethods[record.level]
            consoleOutput(result)
        }catch(e:any){   
            console.log(e.stack)
        }        
    } 
}