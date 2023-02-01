import BatchBackend from 'voerkalogger/BatchBackendBase';
import axios,{AxiosInstance} from 'axios';
import { BatchBackendBaseOptions } from 'voerkalogger';
import { VoerkaLogger } from '../../Logger';
import { VoerkaLoggerRecord } from '../../types';



export interface HttpBackendOptions<Output=VoerkaLoggerRecord> extends BatchBackendBaseOptions<Output>{
    url      : string
    method   : 'post' 
    headers   : Record<string, any>      // 认证信息
}



export default class HttpBackends extends BatchBackend<HttpBackendOptions> {
    constructor(options?:HttpBackendOptions) {
        super(Object.assign({
                url      : '',
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
