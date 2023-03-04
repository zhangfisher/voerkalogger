import type { BackendBase } from "../BackendBase"
import type { VoerkaLogger } from "../Logger"
import type { VoerkaLoggerRecord } from "../types"
import { getInterpolatedVars } from "../utils"

// 默认的格式化器
export function standard<T=string>(this:VoerkaLogger,record:VoerkaLoggerRecord,backend?:BackendBase):T{     
    const logger = this
    let extra = []
    if(Array.isArray(record.tags) && record.tags.length>0){
        extra.push(`tags=${record.tags.join(',')}`)
    }
    if(record.scope){
        extra.push(`module=${record.scope}` )
    }     
    return `[{level}] - {datetime} : {message}${extra.length>0 ? '('+extra.join(",")+')' : ''}`.params(getInterpolatedVars.call(this,record) )   as T
} 
