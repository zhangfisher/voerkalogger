import { LogMethodVars, VoerkaLogger, VoerkaLoggerLevel, VoerkaLoggerRecord } from "@voerkalogger/core";
import { timer,delay } from "flex-tools"
import HttpTransport from "@voerkalogger/http"
import axios from "axios"
import mockAdapter from "axios-mock-adapter"
import type { AxiosRequestConfig } from 'axios';

const logger = new VoerkaLogger()

type HttpOutputType = VoerkaLoggerRecord & {
    scope:"888888"
}
const httpTransport = new HttpTransport<HttpOutputType>({
    url:"/log",
    format:function(record:VoerkaLoggerRecord,vars: LogMethodVars){
        return {
            ...record,
            scope:"888888"
        }
    }
})
const axiosInstance = axios.create(httpTransport.options)
const mock = new mockAdapter(axiosInstance, { delayResponse: 1000 });
httpTransport.http = axiosInstance

logger.use("http",httpTransport)

mock.onPost("/log").reply((config:AxiosRequestConfig)=>{
    let logs = JSON.parse(config.data)
    logs.forEach((log:any)=>{
        console.log("Receive:",JSON.stringify(log))
    })
    return [200]
})

logger.transports.console.enabled = false
logger.level = VoerkaLoggerLevel.NOTSET
timer.begin()
logger.error("程序出错{}",new TypeError("数据类型出错"))
logger.info("应用启动完毕，耗时{s}s",123)
logger.debug("打开程序{#red a}{b}",{a:1,b:2})
logger.debug("打开程序{a}{b}",{a:1,b:2},{module:"switch",tags:["light","color"]})
logger.debug("打开程序{a}{b}",{a:1,b:2},{module:"switch"})
logger.warn("中华人民共和国{}{}{}",['繁荣','富强','昌盛'])
logger.warn("中华人民共和国{a}{b}{c}",{a:'繁荣',b:'富强',c:'昌盛'})
logger.error("程序{}出现致命错误:{}",["MyApp","无法加载应用"])
logger.fatal("程序{}出现致命错误:{}",["MyApp","无法加载应用"])
timer.end()
 

setTimeout(async () => { 
    await delay(100)
    await logger.flush()
    await logger.destory()        
    console.log("End")
})
