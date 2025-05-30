import { useState, useEffect, useRef, useCallback } from 'react';
import { createAlova } from 'alova';
import { useRequest } from 'alova/client';
import ReactHook from 'alova/react';
import adapterFetch from 'alova/fetch';
// 创建alova实例
const alovaInstance = createAlova({
  baseURL: '/api',
  statesHook: ReactHook,
  requestAdapter: adapterFetch(),
  responded: (response: any) => {
    try {
      return response.json();
    } catch (error) {
      return response;
    }
  },
  // ...其他配置
});

// 用户类型定义
interface User {
  id: number;
  name: string;
  email: string;
}

// 请求参数类型
interface ListRequestParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

// 请求方法
const fetchUsers = (params: ListRequestParams) =>
  alovaInstance.Get<{ data: User[]; pageSize: number }>('/users', { params });

function UserList() {
  const [listData, setListData] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [keyword, setKeyword] = useState('');
  const pageSize = 2;
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // 使用alova的useRequest
  const { send: fetchData } = useRequest((params: ListRequestParams) => fetchUsers(params), {
    immediate: false,
  });

  // 加载数据函数
  const loadData = useCallback(
    async (isNewSearch = false) => {
      if (loadingRef.current || !hasMore) return;

      loadingRef.current = true;
      const currentPage = isNewSearch ? 1 : page;

      try {
        const { data, pageSize } = await fetchData({
          page: currentPage,
          pageSize,
          keyword: keyword.trim(),
        });
        console.log(`data`, data);

        setHasMore(data.length >= pageSize);
        setListData((prev) => (isNewSearch ? data : [...prev, ...data]));
        if (!isNewSearch) setPage((p) => p + 1);
      } finally {
        loadingRef.current = false;
      }
    },
    [page, keyword, hasMore, fetchData],
  );
  console.log(`listData`, listData);

  // 搜索处理（带防抖）
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadData(true);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [keyword]);

  // 滚动处理
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - (scrollTop + clientHeight) < 50) {
        loadData();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadData]);

  return (
    <div>
      <input
        type="text"
        placeholder="搜索用户..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <div ref={containerRef} style={{ height: '70vh', overflowY: 'auto' }}>
        {listData.map((user) => (
          <div key={user.id} className="user-item">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        ))}

        {loadingRef.current && <div>加载中...</div>}
        {!hasMore && <div>没有更多数据了</div>}
      </div>
    </div>
  );
}

export default UserList;
