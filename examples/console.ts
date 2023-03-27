import { VoerkaLogger, VoerkaLoggerLevel } from "@voerkalogger/core/src";
import ConsoleTransport from "@voerkalogger/core/src/console";
import { timer } from "flex-tools"

let logger = new VoerkaLogger()

logger.level = VoerkaLoggerLevel.NOTSET
timer.begin()
logger.error("程序出错{}",new TypeError("数据类型出错"))
logger.debug("打开程序{#red a}{b}",()=>({a:11,b:2}))
logger.info("应用启动完毕，耗时{s}s",123)
logger.debug("打开程序{#red a}{b}",{a:1,b:2})
logger.debug("打开程序{a}{b}",{a:1,b:2},{module:"switch",tags:["light","color"]})
logger.debug("打开程序{a}{b}",{a:1,b:2},{module:"switch",scope:"layout"})
logger.warn("中华人民共和国{}{}{}",['繁荣','富强','昌盛'])
logger.warn("中华人民共和国{a}{b}{c}",{a:'繁荣',b:'富强',c:'昌盛'})
logger.error("程序{}出现致命错误:{}",["MyApp","无法加载应用"])
logger.fatal("程序{}出现致命错误:{}",["MyApp","无法加载应用"])
timer.end()

console.log("------- module:messager ----------------")

let messageLogger = logger.createScope({module:"messager"})
messageLogger.debug("打开程序{a}{b}",{a:1,b:2},{tags:["light","color"]})
messageLogger.debug("打开程序{a}{b}",{a:1,b:2})
messageLogger.warn("中华人民共和国{}{}{}",['繁荣','富强','昌盛'])
messageLogger.warn("中华人民共和国{a}{b}{c}",{a:'繁荣',b:'富强',c:'昌盛'})
messageLogger.error("程序{}出现致命错误:{}",["MyApp","无法加载应用"])
messageLogger.fatal("程序{}出现致命错误:{}",["MyApp","无法加载应用"]);


console.log("------- module:messager/device ----------------")
let deviceLogger = messageLogger.createScope({module:"device"})
deviceLogger.debug("打开程序{a}{b}",{a:1,b:2})
deviceLogger.warn("打开程序{a}{b}",{a:1,b:2})


setTimeout(() => {
    logger.destory().then(() =>{
        console.log("End")
    })
})


