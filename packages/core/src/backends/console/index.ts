/**
 * this指向实现Logger实例
 
 * 
 */
import { BackendBase } from '../../BackendBase';
import { BackendBaseOptions, VoerkaLoggerFormatter, VoerkaLoggerRecord } from "../../types"

const consoleMethods=[
    console.log,
	console.debug,
	console.info,
	console.warn,
	console.error,
    console.error
]

export interface ConsoleBackendOptions extends BackendBaseOptions{
    
}

 
export default class ConsoleBackend extends BackendBase<ConsoleBackendOptions,string>{     
    constructor(options?:ConsoleBackendOptions){
        super(Object.assign({
            format:"[{level}] - {datetime} : {message}{,module}{,tags}"    
        },options))
    }
    async format(record: VoerkaLoggerRecord):Promise<string>{                
        const formatter = this.options.format 
        const template:string | null = typeof formatter === "function" ? (formatter(record, this) as unknown as string) : formatter
        return template ? template.params(record) : String(record)
    }
    // 负责输出日志内容
    async output(result:string,record:VoerkaLoggerRecord){
        // 进行单元测试时不在 console 中输出
        try{
            if(process.env.NODE_ENV === "test") return 
        }catch{
            return
        }
        try{
            let consoleOutput = consoleMethods[record.level]
            consoleOutput(result)
        }catch(e:any){   
            console.log(e.stack)
        }         
    } 
}