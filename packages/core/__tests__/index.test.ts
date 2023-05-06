import {test,expect} from "vitest"
import { VoerkaLogger } from '../src/Logger';


test("缓存输出",()=>{
    let logger = new VoerkaLogger({
        injectGlobal:false,
        enable:false
    })

    new Array(10).fill(0).forEach((_,i)=>{
        logger.info(`test:${i+1}`)
    })

})