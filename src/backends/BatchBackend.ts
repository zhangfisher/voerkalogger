/**
 * 批处理后端
 * 
 * 实现批量处理日志的功能，即保存一批数据后再进行处理
 * 
 * 配置参数：
 * {
 *    bufferSize:100             // 缓存大小
 * }
 * 
 * 
 */

import { BatchBackendBaseOptions, LogRecord } from "../types"
import BackendBase from "./BackendBase"


export default class BatchBackend<T extends BatchBackendBaseOptions> extends BackendBase<T>{
    #buffer:LogRecord[]=[]
    #intervalId:any=0
    #flushing:boolean=false
    constructor(options:T){
        super(Object.assign({
            flushInterval:1000 * 60,            // 延迟输出时间间隔
            bufferSize:100                      // 默认缓冲区大小 
        },options))        
    }  
    get options() : Required<T> { return super.options as Required<T>}
    get enabled() { return super.enabled as boolean}
    set enabled(value:boolean) { 
        this.options.enabled = value
        if(value){
            this._delayFlushLogs()
        }else{
            clearInterval(this.#intervalId)
        }
    }
    async reset(){
        await super.reset()           
        this._delayFlushLogs()
    }
    /**
     * 当缓冲区大于指定数量输出，或者达到指定时间间隔也进行输出 
     */
    _delayFlushLogs(){
        clearInterval(this.#intervalId)
        this.#intervalId =  setInterval(async ()=>{
            if(!this.#flushing){
                await this.flush()
            }              
        },this.options.flushInterval) 
    }
    /**
     * 马上将缓冲区的内容输出
     */
    async flush(){ 
        if(!this.#flushing && this.#buffer.length > 0){
            this.#flushing =true
            try{
               await this.batchOutput(this.#buffer) 
            }catch(e:any){
                console.warn("Error while batchOutput logs:",e.message)
            }finally{                
               this.#buffer = []
               this.#flushing = false
            }          
        }        
    }
    async output(result:any,record:LogRecord){
        this.#buffer.push(result)   
        // 如果超出缓冲区，则马上进行提交
        if(!this.#flushing && this.#buffer.length>=(this.options.bufferSize || 100)){
            await this.flush()
        } 
    }
    /**
     * 此方法由子类实现进入输出
     **/ 
    async batchOutput(results:any[]){

    }

}
