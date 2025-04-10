import { VoerkaLogger, VoerkaLoggerLevel,TransportBase } from "@voerkalogger/core";
import { timer,delay } from "flex-tools"
import StorageTransport from "../packages/transports/storage/src"


let logger = new VoerkaLogger({
    enable:false
})

logger.use("file",new StorageTransport() as unknown as TransportBase )

logger.transports.console.enable = false
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
    logger.enable =true
    await logger.transports.file.clear()
    for(let i = 1; i <=1000;i++){
        await delay(10)
        logger.info("运行模块：{}",i,{module:`M${i}`})
    }   
    await logger.flush()
    await delay(1000)
    console.log("End")
})
