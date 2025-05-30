/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\call\index.tsx
 * @Author: zk.su
 * @Date: 2025-02-25 15:18:14
 * @LastEditTime: 2025-04-15 15:15:04
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file index.tsx
 * @fileBase calls
 * @path projects\web-client\src\pages\calls\index.tsx
 * @from
 * @desc
 * @example
 */
import { findManyCall } from '@/api/call';
import { UserModule } from '@/app';
import { useModuleStore } from '@voerka/react';
import { useInfiniteScroll } from 'ahooks';
import { CallSearchBar } from './CallSearchBar';
import { useEffect, useRef, useState } from 'react';
import { CallItem } from './CallItem';
import { CallEntity } from '@/api/call.types';
import { UserOrg } from '../UserOrg/UserOrg';
import CallStatusSideBar from './CallStatusSideBar';
import { useRequest } from 'alova/client';
import { findCallRead, findUnreadCallCount, upsertCallRead } from '@/api/call-read';
import NotData from '@/components/NotData';
import { LoadingDots } from '@/components/loading-dots';
export interface CallsProps {
    // value: any
}
const pageSize = 20;
export const Calls: React.FC<CallsProps> = () => {
    const userStore = useModuleStore<UserModule>('user');
    //获取当前登录的用户id
    // @ts-ignore
    const [ownerId] = userStore.useReactive('user.id');
    const containerRef = useRef<HTMLDivElement>(null);
    const [filterText, setFilterText] = useState('');
    const [orderByTime, setOrderByTime] = useState(false); //通讯录默认降序
    const [statusId, setStatusId] = useState<number | undefined>(undefined);
    const { data, loading, loadMore, loadingMore, noMore, reload, mutate } = useInfiniteScroll(
        async (d) => {
            const page = d ? Math.floor(d.list.length / pageSize) + 1 : 1;
            return await findManyCall({
                page,
                pageSize,
                ownerId,
                filterText,
                orderByTime,
                statusId,
            }).send(true);
        },
        {
            target: containerRef,
            isNoMore: (result) => (result?.list?.length ?? 0) >= result?.total,
            reloadDeps: [ownerId, filterText, orderByTime, statusId],
        },
    );
    const { data: callRead } = useRequest(findCallRead, {
        immediate: true,
        force: true,
    });

    useEffect(() => {
        return () => {
            upsertCallRead().send(true);
        };
    }, []);

    const calls = data?.list;
    return (
        <div className="flex h-full @container">
            <aside className="flex-none w-64 bg-secondary">
                <CallStatusSideBar value={statusId} onValueChange={setStatusId}></CallStatusSideBar>
            </aside>
            <main className="flex flex-col items-center flex-1 p-2 overflow-auto bg-primary-foreground">
                <div className="flex flex-col flex-1 w-full max-w-screen-lg max-h-full gap-2">
                    {/* 通讯录 这里最重要是发起通话 */}
                    <CallSearchBar
                        filterText={filterText}
                        onFilterTextChange={(value) => {
                            setFilterText(value);
                        }}
                        orderByTime={orderByTime}
                        onOrderByTimeChange={(value) => {
                            setOrderByTime(value);
                        }}
                        refresh={() => {
                            reload();
                        }}></CallSearchBar>
                    <div
                        ref={containerRef}
                        className="flex flex-col flex-1 max-h-full min-w-0 gap-2 overflow-auto text-center ">
                        {!loading && !calls?.length && noMore && (
                            <NotData className="flex-1">暂无通话记录</NotData>
                        )}
                        {!loading &&
                            !!calls?.length &&
                            calls?.map?.((call, index) => (
                                <CallItem
                                    key={index}
                                    className="mb-2"
                                    call={call}
                                    callRead={callRead}></CallItem>
                            ))}
                        <div style={{ marginTop: 8 }}>
                            {!noMore && (
                                <button type="button" onClick={loadMore} disabled={loadingMore}>
                                    {/* {loadingMore ? '数据载入中，请稍等' : '加载中'} */}
                                    <LoadingDots color="primary"></LoadingDots>
                                </button>
                            )}
                            {!!calls?.length && !!noMore && <span>已经最后一页啦</span>}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// 默认导出
export default Calls;
