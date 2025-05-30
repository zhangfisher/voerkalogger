import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import ReactHook from 'alova/react';
import { getToken } from '@/utils/token';
import { createClientTokenAuthentication } from 'alova/client';

export const baseURL = import.meta.env.DEV ? '/api' : '/api'; // 由于腾辉说要不要反向代理而是直接使用本地webRoot所以这样弄
export const { onAuthRequired } = createClientTokenAuthentication({
    // 配置项
    assignToken: (method) => {
        method.config.headers.Authorization = 'Bearer ' + getToken();
    },
});
export const alovaInstance = createAlova({
    baseURL,
    statesHook: ReactHook,
    requestAdapter: adapterFetch(),
    beforeRequest: onAuthRequired((method) => {
        // console.log(`method`, method);
    }),
    responded: async (response) => {
        // console.log(`response`, response);
        let result;
        if (response.status >= 500) {
            throw new Error(`服务器宕机,${response.statusText}`);
        }
        if (response.status === 404) {
            throw new Error(`接口不存在,${response.statusText}`);
        }
        if (response.status === 403) {
            throw new Error(`没有权限,${response.statusText}`);
        }
        if (response.status >= 400) {
            throw new Error(`请求错误,${response.statusText}`);
        }
        try {
            result = await response.json();
            return result;
        } catch (err) {
            // 不是json 的化直接返回非json字段
            return response;
        }
    },
});

// declare global {
//   $api: typeof alovaInstance;
// }
import.meta.env.DEV && (globalThis.$api = alovaInstance);
