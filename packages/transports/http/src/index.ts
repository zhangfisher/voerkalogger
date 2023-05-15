import axios from 'axios';
import { VoerkaLoggerLevel,TransportBase, TransportBaseOptions, TransportOptions, VoerkaLoggerRecord } from '@voerkalogger/core';
import type { AxiosRequestConfig} from 'axios';
import { assignObject } from 'flex-tools';
import { AxiosInstance } from 'axios';

export type HttpTransportOptions<Output> = TransportBaseOptions<Output>  & AxiosRequestConfig & { url: string } 

export default class HttpTransport<Output=VoerkaLoggerRecord> extends TransportBase<HttpTransportOptions<Output>> {
    #http?: AxiosInstance
    constructor(options?: TransportOptions<HttpTransportOptions<Output>>) {
        super(assignObject({ 
                url      : '',
                method   : 'post',                      // 访问方法
                contentType : 'application/json'
            },options)
        );
       this.createAxiosInstance()
    } 
    get http(){return this.#http!}
    set http(value: AxiosInstance){this.#http = value}     
    /**
     * 当配置变更时重新实例化Axios
     */
    onOptionUpdated(){        
        this.createAxiosInstance()
    }
    private createAxiosInstance(){
        try{
            this.#http = axios.create(this.options as AxiosRequestConfig)
            this.isAvailable()
        }catch(e:any){
            this.logger?.log("Error while create axio instance for logger transport<{}>:{}",[this.constructor.name,e],{level:VoerkaLoggerLevel.ERROR},['console'])            
        }
    }
    /**
     * 检测http配置是否正确
     * 主要是配置http的url,如果没有配置url,则代表不可用
     * 
     * 如果不可用时会给出警告
     */
    isAvailable(){
        const url = this.options.url
        let available = typeof(url)=='string' && url.length>0
        return available && typeof(this.#http)=='object'
    }
    async output(results:Output[]) {
        await this.#http?.request({
            ...this.options as AxiosRequestConfig,
            data: results
        })  
    } 
}
