import BatchBackend from './BatchBackend';
import axios,{AxiosInstance} from 'axios';
import { BatchBackendBaseOptions } from '../types';



export interface HttpBackendOptions extends BatchBackendBaseOptions{
    url      : string
    format   : boolean   
    method   : 'post' 
    headers   : Record<string, any>      // 认证信息
}



export default class HttpBackend extends BatchBackend<HttpBackendOptions> {
    constructor(options:HttpBackendOptions) {
        super(Object.assign({
                url      : '',
                format   : false,                       // 输出JSON日志
                method   : 'post',                      // 访问头
                headers   : {},                         // 认证信息
            },options)
        );
    }
    async batchOutput(results:any[]) {
        try {
            await axios.post(this.options.url,{
                data: results,
                auth:this.options.auth,
                headers:this.options.headers
            }) 
        } catch (e) {
            console.error(e);
        }
    }
}
