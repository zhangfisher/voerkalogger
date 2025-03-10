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
    page?:number,
    pageSize?:number,
    level?:string,
    tags?:string[],
    module?:string,
}
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
            this._storage = localForage.createInstance({
                name: this.options.appName,
                storeName: this.options.storeName,
            })            
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
            const keys = Array.from({length:endIndex-beginIndex},(_,i)=>`${beginIndex+i}`)
            await Promise.all(keys.map(async key=>{
                await this.storage.removeItem(key)
            }))
            meta.beginIndex = endIndex
            await this.storage.setItem('meta',meta)
        }
    }
     
    async getLogs(query:StorageTransportQuery):Promise<VoerkaLoggerRecord[]>{
        const { page=0,pageSize=0 } = Object.assign({},query)
        const isPaging = page>0 && pageSize>0
        const {beginIndex,endIndex } = await this._getMeta()
    
        const pageStartIndex = isPaging ? (page-1) * pageSize : 0

        const keys = Array.from({
            length:page==0 || pageSize==0 ?
                endIndex - beginIndex :                         // 读取所有日志
                pageSize                                        // 读取指定页数的日志
        },(_,i)=>`${pageStartIndex+i}`)

        const logs = (await Promise.all(keys.map(async key=>{
            return this.storage.getItem<VoerkaLoggerRecord>(key)
        }))).filter((item)=>item!=null) as VoerkaLoggerRecord[]

        return logs
    }


    async clear() {
        return this.storage.clear()
    }

    destroy(): void {
        this.storage.dropInstance()
    }
}
