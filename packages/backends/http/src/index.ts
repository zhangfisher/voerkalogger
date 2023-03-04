import axios from 'axios';
import { BackendBase, BackendBaseOptions, BackendOptions, LogMethodVars, VoerkaLoggerRecord } from '@voerkalogger/core';
import type { AxiosInstance,AxiosRequestConfig} from 'axios';
import { assignObject } from 'flex-tools';

export type HttpBackendOptions<Output> = BackendBaseOptions<Output>  & AxiosRequestConfig & { url: string } 

export default class HttpBackend<Output=VoerkaLoggerRecord> extends BackendBase<HttpBackendOptions<Output>> {
    #http: AxiosInstance
    constructor(options?: BackendOptions<HttpBackendOptions<Output>>) {
        super(assignObject({ 
                url      : '',
                method   : 'post',                      // 访问方法
                contentType : 'application/json'
            },options)
        );
        this.#http = axios.create(this.options as AxiosRequestConfig)
    } 
    get http(){return this.#http}
    set http(value: AxiosInstance){this.#http = value}
    async output(results:Output[]) {
        await this.#http.request({
            ...this.options as AxiosRequestConfig,
            data: results
        })  
    } 
}
