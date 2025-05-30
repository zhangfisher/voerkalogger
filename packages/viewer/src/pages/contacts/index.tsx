/*
 * @FilePath: \voerka-phone\projects\web-client\src\pages\contacts\index.tsx
 * @Author: zk.su
 * @Date: 2025-02-25 15:18:14
 * @LastEditTime: 2025-04-15 17:41:18
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file index.tsx
 * @fileBase contacts
 * @path projects\web-client\src\pages\contacts\index.tsx
 * @from
 * @desc
 * @example
 */
import { findManyContact } from '@/api/contact';
import { UserModule } from '@/app';
import { useModuleStore } from '@voerka/react';
import { useInfiniteScroll } from 'ahooks';
import { ContactSearch } from './ContactSearch';
import { useCallback, useRef, useState } from 'react';
import { Contact, ContactBar } from './ContactBar';
import { UserOrg } from '../UserOrg/UserOrg';
import NotData from '@/components/NotData';
import { LoadingDots } from '@/components/loading-dots';
export interface ContactsProps {
    // value: any
}
const pageSize = 20;
export const Contacts: React.FC<ContactsProps> = () => {
    //获取当前登录的用户id
    const containerRef = useRef<HTMLDivElement>(null);
    const [filterText, setFilterText] = useState('');
    const [filterByHasStar, setFilterByHasStar] = useState(false);
    const [orderByTitle, setOrderByTitle] = useState(true); //通讯录默认升序
    const [deptId, setDeptId] = useState<number | undefined>(undefined);
    const { data, loading, loadMore, loadingMore, noMore, reload, mutate } = useInfiniteScroll(
        async (d) => {
            const page = d ? Math.floor(d.list.length / pageSize) + 1 : 1;
            const options = {
                page,
                pageSize,
                filterText,
                filterByHasStar,
                orderByTitle,
                deptId,
            };
            return await findManyContact(options).send(true);
        },
        {
            target: containerRef,
            isNoMore: (result) => result?.list?.length >= result?.total,
            onFinally: (result) => {
                console.log(`获取Contacts响应 onFinally`, result);
            },
            reloadDeps: [filterText, filterByHasStar, orderByTitle, deptId],
        },
    );
    const contacts = data?.list;
    //更新收藏
    const onStarChange = async (contact: Contact) => {
        reload();
    };
    return (
        <div className="flex h-full @container">
            <aside className="flex-none w-64 bg-secondary">
                <UserOrg selectedId={deptId} onSelect={setDeptId} editable={false}></UserOrg>
            </aside>
            <main className="flex flex-col items-center flex-1 p-2 overflow-auto bg-primary-foreground">
                <div className="flex flex-col flex-1 w-full max-w-screen-lg max-h-full gap-2">
                    {/* 通讯录 这里最重要是发起通话 */}
                    <ContactSearch
                        loading={loading}
                        filterText={filterText}
                        onFilterTextChange={(value) => {
                            setFilterText(value);
                        }}
                        isTitleDesc={!orderByTitle}
                        onIsTitleDescChange={(value) => {
                            setOrderByTitle(!value);
                        }}
                        filterByStar={filterByHasStar}
                        onFilterByStarChange={(value) => {
                            setFilterByHasStar(value);
                        }}
                        refresh={() => reload()}></ContactSearch>
                    <div
                        ref={containerRef}
                        className="flex flex-col flex-1 max-h-full min-w-0 gap-2 overflow-auto text-center ">
                        {!loading && !contacts?.length && noMore && (
                            <NotData className="flex-1"></NotData>
                        )}
                        {!loading &&
                            !!contacts?.length &&
                            contacts?.map?.((contact, index) => (
                                <ContactBar
                                    className="mb-2"
                                    contact={contact}
                                    key={index}
                                    onStarChange={onStarChange}></ContactBar>
                            ))}
                        <div style={{ marginTop: 8 }}>
                            {!noMore && (
                                <button type="button" onClick={loadMore} disabled={loadingMore}>
                                    {/* {loadingMore ? <LoadingDots color="primary" /> : '加载中'} */}
                                    <LoadingDots color="primary" />
                                </button>
                            )}
                            {!!contacts?.length && !!noMore && <span>已经最后一页啦</span>}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// 默认导出
export default Contacts;
