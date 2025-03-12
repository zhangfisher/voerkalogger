import { TransportBase, TransportBaseOptions, TransportOptions, VoerkaLoggerRecord } from '@voerkalogger/core';
import { assignObject } from 'flex-tools/object/assignObject';
import localForage from 'localforage';
import { delay } from 'flex-tools/async/delay';
import { VoerkaLoggerLevelName } from '@voerkalogger/core';
import { VoerkaLoggerLevelNames } from '@voerkalogger/core';

export type StorageTransportOptions<VoerkaLoggerRecord> = TransportBaseOptions<VoerkaLoggerRecord>      
    & { 
        driver: 'auto' | 'IndexedDB' | 'WebSQL' | 'localStorage',
        appName?: string,
        storeName?: string,
        maxCount?: number
    } 

export type StorageTransportVoerkaLoggerRecord = string

export type StorageTransportQuery = {
    page?    : number,
    pageSize?: number,
    levels?  : string | string[]
    sort     : 'asc' | 'desc'
}
export type StorageTransportQueryFilter = (record:VoerkaLoggerRecord)=>boolean


export type StorageTransportLogMeta = {
    beginIndex:number,                  // 起始日志索引
    endIndex:number,                    // 结束日志索引    
}


export default class StorageTransport extends TransportBase<StorageTransportOptions<VoerkaLoggerRecord>> {
    private _storage?:LocalForage;
    constructor(options?: TransportOptions<StorageTransportOptions<VoerkaLoggerRecord>>) {
        super(assignObject({ 
               driver   : 'auto',
               appName  : 'voerka',
               storeName: 'voerkalogs', 
               maxCount : 1000                       // 最大日志数量 
            },options) as TransportOptions<StorageTransportOptions<VoerkaLoggerRecord>>
        );
        this._initStorage()
    }     
    get storage(){ return this._storage!}

    isAvailable(){ 
        return !!this._storage 
    }

    private async _initMeta(){
        const meta = await this.storage.getItem<StorageTransportLogMeta>('meta')
        if(!meta){
            await this.storage.setItem('meta',{
                beginIndex:0,
                endIndex:0 
            })
        }
    }
    private async _getMeta(){
        let meta:StorageTransportLogMeta ={
            beginIndex:0,
            endIndex:0 
        }
        try{            
            let data = await this.storage.getItem<StorageTransportLogMeta>('meta')
            if(data) {
                meta =  data
            }
        }catch(e:any){
            this.logger?.error(e.stack)
        }        
        return meta
    }

    private async _initStorage(){
        try{
            const opts = {
                name: this.options.appName,
                storeName: this.options.storeName,
            }
            
            this._storage = localForage.createInstance(opts)            
            this._initMeta()
        }catch(e:any){
            this.logger?.error(e.stack)
        }        
    }  

    format(record: VoerkaLoggerRecord):any{
        return record
    }

    private async _releaselock(){
        await this.storage.removeItem('_locking')
    }

    private async _acquireLock(){
        const timeout = 5000; // 5 seconds timeout
        const interval = 100; // check every 100ms
        let elapsed = 0;
        while (elapsed < timeout) {
            const writing = await this.storage.getItem<boolean>('_locking');
            if (!writing) break;
            await delay(interval);
            elapsed += interval;
        } 
        await this.storage.setItem('_locking',true)
    } 

    async VoerkaLoggerRecord(items:VoerkaLoggerRecord[]) {
        if(!this.isAvailable()) return
        const meta = await this._getMeta()
        try{
            await this._acquireLock()        
            await Promise.all(items.map(async (item,index)=>{                
                // @ts-ignore
                item.id= `${meta.endIndex+index}`
                await this.storage.setItem(`${meta.endIndex+index}`,item)                
                meta.endIndex++
            }))          
            this._updateIndex(items)
        }finally{
            await this.storage.setItem('meta',meta)
            await this._clearExpiredLogs()
            this._releaselock()
        }
        
    } 

    private async _updateIndex(items:VoerkaLoggerRecord[]){
        type LogLevelIndexes = Record<VoerkaLoggerLevelName,any[]>

        let oldIndex:LogLevelIndexes | null = await this.storage.getItem(`_level_indexes`) 

        let levelIndex:LogLevelIndexes = oldIndex ? oldIndex : {
                NOTSET:[],
                DEBUG:[],
                INFO:[],
                WARN:[],
                ERROR:[],
                FATAL:[]
            } as LogLevelIndexes

        for(let item of items){
            const levelName = VoerkaLoggerLevelNames[item.level] as VoerkaLoggerLevelName            
            if(!levelIndex[levelName]) levelIndex[levelName ] = [] 
            levelIndex[levelName].push(item.id)
        }
        await this.storage.setItem(`_level_indexes`,levelIndex)

    }

    private async _clearExpiredLogs(){
        const meta = await this._getMeta()
        const { beginIndex,endIndex } = meta
        const maxCount = this.options.maxCount
        if(endIndex - beginIndex > maxCount){
            const keys = Array.from({
                length:endIndex-beginIndex-maxCount
            },(_,i)=>`${beginIndex+i}`)
            await Promise.all(keys.map(async key=>{
                await this.storage.removeItem(key)
            }))
            meta.beginIndex = meta.beginIndex + keys.length
            await this.storage.setItem('meta',meta)
        }
    }

     /**
      * 
      * getLogs({
      *     page:1,pageSize:10,
      *     sort:"desc" | 'asc' ,
      *     levels:['DEBUG',"INFO"],
      *     modules:['a','b'],
      * )})
      * 
      * getLogs(record=>record.message.includes('xssss'))
      * 
      * @param query 
      * @returns 
      */
    async getLogs(query:StorageTransportQuery | StorageTransportQueryFilter):Promise<VoerkaLoggerRecord[]>{
        
        if(typeof query == 'function'){            
            const {beginIndex,endIndex } = await this._getMeta()
            const keys = Array.from({
                length:endIndex - beginIndex
            },(_,i)=>`${beginIndex+i}`).reverse() 

            const results:VoerkaLoggerRecord[] = []
            for(let key of keys){
                const record = await this.storage.getItem<VoerkaLoggerRecord>(key)
                if(record && query(record)){
                    results.push(record)
                }
            }
            return results
        }else{
            const { sort= 'desc', page=0,pageSize=0,levels=[] } = Object.assign({},query)
            const isPaging = page>0 && pageSize>0
            const {beginIndex,endIndex } = await this._getMeta()
        
            const pageStartIndex = isPaging ? (page-1) * pageSize : 0
    
            let keys:string[] = Array.from({
                length:page==0 || pageSize==0 ?
                    endIndex - beginIndex :                         // 读取所有日志
                    pageSize                                        // 读取指定页数的日志
            },(_,i)=>`${pageStartIndex+i}`)
    
            // 当指定日志级别
            if(levels.length>0){
                const levelIndexes = await this.storage.getItem<Record<VoerkaLoggerLevelName,string[]>>(`_level_indexes`)
                if(levelIndexes){
                    const lvs = Array.isArray(levels) ? levels : [levels]
                    keys = lvs.reduce((prev,level)=>{
                        return prev.concat(levelIndexes[level.toUpperCase() as VoerkaLoggerLevelName] || [])
                    },[] as string[])
                }            
            }        
            const logs = (await Promise.all(keys.map(async key=>{
                return this.storage.getItem<VoerkaLoggerRecord>(key)
            })))
                .filter((item)=>item!=null)
                .sort((a,b)=>Number(a!.id) - Number(b!.id))                 as VoerkaLoggerRecord[]
    

            return sort==='desc' ? logs.reverse() : logs
        }        
    }


    async clear() {
        return this.storage.clear()
    }

    destroy(): void {
        this.storage.dropInstance()
    }
}
