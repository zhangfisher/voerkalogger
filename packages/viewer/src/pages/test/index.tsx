import React, { useState } from 'react';
import { useInfiniteScroll } from 'ahooks';
import ContactSearch from '../contacts/ContactSearch';

interface Result {
    list: string[];
    nextId: string | undefined;
}

const resultData = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

// 修改函数，添加 filterType 参数
function getLoadMoreList(
    nextId: string | undefined,
    limit: number,
    filterType: 'odd' | 'even' | null,
): Promise<Result> {
    let start = 0;
    // 过滤数据
    const filteredData =
        filterType === 'odd'
            ? resultData.filter((item) => parseInt(item) % 2 !== 0)
            : filterType === 'even'
              ? resultData.filter((item) => parseInt(item) % 2 === 0)
              : resultData;

    if (nextId) {
        start = filteredData.findIndex((i) => i === nextId);
    }
    const end = start + limit;
    const list = filteredData.slice(start, end);
    const nId = filteredData.length > end ? filteredData[end] : undefined;
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                list,
                nextId: nId,
            });
        }, 1);
    });
}

export const Test = () => {
    const [filterType, setFilterType] = useState<'odd' | 'even' | null>(null);
    const [filterText, setFilterText] = useState('');
    const [filterByHasStar, setFilterByHasStar] = useState(false);
    const [orderByTitle, setOrderByTitle] = useState(true); //通讯录默认升序
    const [deptId, setDeptId] = useState<number | undefined>(undefined);
    const { data, loading, loadMore, loadingMore } = useInfiniteScroll(
        (d) => {
            const result = getLoadMoreList(d?.nextId, 4, filterType);
            console.log(result);
            return result;
        },
        {
            // reloadDeps: [filterType],
        },
    );

    const toggleFilter = (type: 'odd' | 'even') => {
        setFilterType((prev) => (prev === type ? null : type));
    };

    return (
        <div>
            {filterType}
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
                }}></ContactSearch>
            {/* 添加过滤按钮 */}
            <div style={{ marginBottom: 8 }}>
                <button
                    type="button"
                    onClick={() => toggleFilter('odd')}
                    style={{ marginRight: 8 }}>
                    {filterType === 'odd' ? '取消奇数过滤' : '显示奇数'}
                </button>
                <button type="button" onClick={() => toggleFilter('even')}>
                    {filterType === 'even' ? '取消偶数过滤' : '显示偶数'}
                </button>
            </div>

            {loading ? (
                <p>loading</p>
            ) : (
                <div>
                    {data?.list?.map((item) => (
                        <div key={item} style={{ padding: 12, border: '1px solid #f5f5f5' }}>
                            item-{item}
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: 8 }}>
                {data?.nextId && (
                    <button type="button" onClick={loadMore} disabled={loadingMore}>
                        {loadingMore ? 'Loading more...' : 'Click to load more'}
                    </button>
                )}

                {!data?.nextId && <span>No more data</span>}
            </div>
        </div>
    );
};
export default Test;
