import {  VoerkaLogger, VoerkaLoggerLevel } from "@voerkalogger/core";
import { timer } from "flex-tools" 

let log = new VoerkaLogger()
//log.level = VoerkaLoggerLevel.NOTSET
timer.begin()
log.level = VoerkaLoggerLevel.DEBUG
log.options.scope.app="xyz"
log.debug("打开程序{a}{b}",()=>({a:11,b:2}),{module:"auth",app:"voerka",lineno:123})
log.error("程序出错{}",new TypeError("数据类型出错"))
log.debug("打开程序{a}{b}",()=>({a:11,b:2}))
log.info("应用启动完毕，耗时{s}s",123)
log.debug("打开程序{a}{b}",{a:1,b:2})
log.debug("打开程序{a}{b}",{a:1,b:2},{module:"switch",tags:["light","color"]})
log.debug("打开程序{a}{b}",{a:1,b:2},{module:"switch",scope:"layout"})
log.warn("中华人民共和国{}{}{}",['繁荣','富强','昌盛'])
log.warn("中华人民共和国{a}{b}{c}",{a:'繁荣',b:'富强',c:'昌盛'})
log.error("程序{}出现致命错误:{}={}",["MyApp","无法加载应用",true])
log.fatal("程序{}出现致命错误:{}",["MyApp","无法加载应用"])
timer.end()

console.log("------- module:messager ----------------")

let messageLogger = log.createScope({app:"voerka",module:"messager"})
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
        console.log("End")
})


