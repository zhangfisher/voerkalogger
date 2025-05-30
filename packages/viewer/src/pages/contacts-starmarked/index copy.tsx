/**
 * @author
 * @file index.tsx
 * @fileBase contacts-starmarked
 * @path projects\web-client\src\pages\contacts-starmarked\index.tsx
 * @from
 * @desc
 * @example
 */

import ListContainer from '@/components/ListContainer';
import { useState, useEffect, memo, useRef } from 'react';
import { ContactBar } from '../contacts/ContactBar';
import { usePagination, useRequest } from 'alova/client';
import { useInfiniteScroll } from 'ahooks';
import { Button } from '@/components/ui/button';
export interface ContactsStarMarkedProps {
  // value: any
}
export const ContactsStarMarked: React.FC<ContactsStarMarkedProps> = () => {
  // const App = () => {
  // const {
  //   // 加载状态
  //   loading,
  //   // 列表数据
  //   data,
  //   // 是否为最后一页
  //   // 下拉加载时可通过此参数判断是否还需要加载
  //   isLastPage,
  //   // 当前页码，改变此页码将自动触发请求
  //   page,
  //   // 每页数据条数
  //   pageSize,
  //   // 分页页数
  //   pageCount,
  //   // 总数据量
  //   total,
  //   // 更新状态
  //   update
  // } = usePagination(
  //   // Method实例获取函数，它将接收page和pageSize，并返回一个Method实例
  //   (page, pageSize) => findManyContacts(page, pageSize),
  //   {
  //     // 请求前的初始数据（接口返回的数据格式）
  //     initialData: {
  //       total: 0,
  //       data: []
  //     },
  //     initialPage: 1, // 初始页码，默认为1
  //     initialPageSize: 10 // 初始每页数据条数，默认为10
  //   }
  // );
  // const container = useRef(null)
  // return (
  //   <div></div>
  //   // <div className="w-full h-full bg-primary-foreground">
  //   //   <main className="flex flex-col w-full max-w-screen-lg max-h-full gap-2 overflow-auto">
  //   //   {data.data?.map((contact) => {
  //   //     return <ContactBar contact={contact} toggleStar={toggleStar}></ContactBar>;
  //   //   })}
  //   //   {loading && <p>加载中...</p>}
  //   //   {!loading && <Button>加载更多</Button>}
  //   //   {isLastPage && <p>没有更多数据了</p>}
  //   //  </main>
  //   // </div>
  // );
};

// 默认导出
export default ContactsStarMarked;
