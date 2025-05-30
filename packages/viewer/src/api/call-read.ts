/*
 * @FilePath: \voerka-phone\projects\web-client\src\api\call-read.ts
 * @Author: zk.su
 * @Date: 2025-04-02 16:58:12
 * @LastEditTime: 2025-04-15 14:51:36
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
import { alovaInstance } from './alova';
import type { CallRead } from './call-read.type';

//统计最新未读数量
export function findUnreadCallCount() {
    return alovaInstance.Get<number>(`/call-read/unread`);
}

export function findCallRead() {
    return alovaInstance.Get<CallRead>(`/call-read`);
}

export function upsertCallRead() {
    return alovaInstance.Post(`/call-read`);
}
