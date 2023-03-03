import axios from 'axios';
import { BackendBase, BackendBaseOptions, LogMethodVars, VoerkaLoggerRecord } from '@voerkalogger/core';
import type { AxiosInstance,AxiosRequestConfig} from 'axios';
import { assignObject } from 'flex-tools';

 


export interface HttpBackendOptions extends BackendBaseOptions,AxiosRequestConfig{
    url      : string 
} 

export default class HttpBackend<T=VoerkaLoggerRecord> extends BackendBase<HttpBackendOptions,T> {
    #http: AxiosInstance
    constructor(options:HttpBackendOptions) {
        super(assignObject({
                url      : '',
                method   : 'post',                      // 访问头
                contentType : 'application/json',
                headers   : {},                         // 认证信息
            },options)
        );
        this.#http = axios.create(this.options)
    }
    format(record: VoerkaLoggerRecord, interpVars: LogMethodVars) {
        return record as T
    }    
    async outoput(results:T[]) {
        const response = await this.#http.request({
            ...this.options,
            data: results
        })  

    }

    async destroy(){

    }
}
