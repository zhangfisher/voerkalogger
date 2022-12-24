/**
 * this指向实现Logger实例
 
 * 
 */
import BackendBase from "./BackendBase"
import { BackendBaseOptions, LogRecord } from "../types"

const consoleMethods=[
    console.log,
	console.debug,
	console.info,
	console.warn,
	console.error,
	console.error
]

export default class ConsoleBackend extends BackendBase{ 
    // 负责输出日志内容
    async output(result:any,record:LogRecord){
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