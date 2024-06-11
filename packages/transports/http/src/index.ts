import { TransportBase, TransportBaseOptions, TransportOptions, VoerkaLoggerRecord } from '@voerkalogger/core';
import { assignObject } from 'flex-tools/object/assignObject';

export type HttpTransportOptions<Output> = TransportBaseOptions<Output>      
    & { url: string } 
    & Omit<RequestInit,'Body'>

export default class HttpTransport<Output=VoerkaLoggerRecord> extends TransportBase<HttpTransportOptions<Output>> {
    constructor(options?: TransportOptions<HttpTransportOptions<Output>>) {
        super(assignObject({ 
                url      : '',
                method   : 'post',                      // 访问方法
                contentType : 'application/json'
            },options) as TransportOptions<HttpTransportOptions<Output>>
        );
    }      
    /**
     * 当配置变更时重新实例化Axios
     */
    onOptionUpdated(){        
         
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
        return available 
    }
    async output(results:Output[]) {
        try {
            const response = await fetch(this.options.url, { 
                ...this.options,
                body: JSON.stringify(results)
            });            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.statusText}`);
            }             
        } catch (error) {
            console.error('Error fetching data:', error);
        } 
    } 
}
