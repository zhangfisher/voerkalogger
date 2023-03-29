import axios from 'axios';
import { TransportBase, TransportBaseOptions, TransportOptions, VoerkaLoggerRecord } from '@voerkalogger/core';
import type { AxiosInstance,AxiosRequestConfig} from 'axios';
import { assignObject } from 'flex-tools';

export type HttpTransportOptions<Output> = TransportBaseOptions<Output>  & AxiosRequestConfig & { url: string } 

export default class HttpTransport<Output=VoerkaLoggerRecord> extends TransportBase<HttpTransportOptions<Output>> {
    #http: AxiosInstance
    constructor(options?: TransportOptions<HttpTransportOptions<Output>>) {
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
