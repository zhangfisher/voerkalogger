/**
 * @author
 * @file index.tsx
 * @fileBase log
 * @path projects\web-client\src\pages\log\index.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
import LogTopBar from './LogTopBar';
import { usePagination } from 'ahooks';

export interface ErrorLogProps {
  // value: any
}
import { levelOptions } from './LogTopBar';
import LogList from './LogList';
import { PaginationBar } from '@/components/pagination';
// const pageSize = 20;
export const LogPage: React.FC<ErrorLogProps> = () => {
  const [filterText, setFilterText] = useState('');
  const [isAsc, setIsAsc] = useState<boolean>(true);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    levelOptions.filter((level) => level !== 'debug'),
  );
  const pageSize = 20;

  const findManyLogs = async ({
    current = 1,
    pageSize = 20,
  }: {
    current: number;
    pageSize: number;
  }) => {
    console.log(current, pageSize);
    // @ts-ignore
    const total = await logger.transports.storage.getCount({
      levels: selectedLevels,
    });
    const results = await logger.transports.storage.getLogs({
      page: current,
      pageSize,
      levels: selectedLevels,
      sort: isAsc ? 'asc' : 'desc',
    } as any);
    // return results;
    return { list: results, total: total };
  };
  const { data, loading, pagination, refresh } = usePagination(findManyLogs, {
    refreshDeps: [filterText, isAsc, selectedLevels, pageSize],
    defaultPageSize: pageSize,
  });
  console.log('data,loading', data, loading, pagination);
  return (
    <main className="flex flex-col h-screen space-y-2 overflow-hidden">
      <LogTopBar
        filterText={filterText}
        onFilterTextChange={setFilterText}
        refresh={() => refresh()}
        selectedLevels={selectedLevels}
        setSelectedLevels={setSelectedLevels}
        isAsc={isAsc}
        setIsAsc={setIsAsc}></LogTopBar>
      <LogList data={data?.list} loading={loading}></LogList>
      <PaginationBar
        pagination={{
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        onPageChange={(page) => {
          pagination.onChange(page);
        }}></PaginationBar>
    </main>
  );
};

// 默认导出
export default LogPage;
