import axios from 'axios';
import { BackendBase, BackendBaseOptions, LogMethodVars, VoerkaLoggerRecord } from '@voerkalogger/core';
import type { AxiosInstance,AxiosRequestConfig} from 'axios';
import { assignObject } from 'flex-tools';

 


export interface HttpBackendOptions extends BackendBaseOptions,AxiosRequestConfig{
    url      : string 
} 



export default class HttpBackend<OutputRecord = string> extends BackendBase<OutputRecord,HttpBackendOptions> {
    #http?: AxiosInstance
    constructor(options:HttpBackendOptions) {
        super(assignObject({ 
                url      : '',
                method   : 'post',                      // 访问方法
                contentType : 'application/json'
            },options)
        );
        this.#http = axios.create(this.options)
    } 
    get http(){ return this.#http as AxiosInstance }
    set http(value:AxiosInstance){ this.#http = value }
    async outoput(results:OutputRecord[]) {        
        await this.#http?.request({
            ...this.options,
            data: results
        })  
    }

    async destroy(){
        this.#http = undefined
    }
}
