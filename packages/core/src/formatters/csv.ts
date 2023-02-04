import type { BackendBase } from "../BackendBase"
import type { VoerkaLogger } from "../Logger"
import type { VoerkaLoggerRecord } from "../types"
import { getInterpolatedVars } from "../utils"

// 默认的格式化器
export function csv(this:VoerkaLogger,record:VoerkaLoggerRecord,backend?:BackendBase):string{     
    const logger = this
    let extra = []
    if(Array.isArray(record.tags) && record.tags.length>0){
        extra.push(`tags=${record.tags.join(',')}`)
    }
    if(record.module){
        extra.push(`module=${record.module}` )
    }     
    return `{level},{datetime},{message}`
} 
