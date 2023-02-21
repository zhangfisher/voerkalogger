import { VoerkaLogger, VoerkaLoggerLevel } from "./src";
import { timer } from "flex-tools"

let logger = new VoerkaLogger()

logger.level = VoerkaLoggerLevel.NOTSET
timer.begin()
logger.error("程序出错{}",new TypeError("数据类型出错"))
logger.info("应用启动完毕，耗时{s}s",123)
logger.debug("打开程序{a}{b}",{a:1,b:2})
logger.debug("打开程序{a}{b}",{a:1,b:2},{module:"switch",tags:["light","color"]})
logger.debug("打开程序{a}{b}",{a:1,b:2},{module:"switch"})
logger.warn("中华人民共和国{<*><*>}{<,&><&>}{,}",[1,2,3])
logger.fatal("程序{}出现致命错误:{}",["MyApp","无法加载应用"])
timer.end()