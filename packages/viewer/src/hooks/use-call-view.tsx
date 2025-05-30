/**
 * @author
 * @file use-call-view.tsx
 * @fileBase use-call-view
 * @path projects\web-client\src\hooks\use-call-view.tsx
 * @from
 * @desc
 * @example
 */

import { useRequest } from "alova/client";
import { useState, useEffect } from "react";

export default function useCallView() {
  const [lastViewTime, setLastViewTime] = useState(Date.now());
  // 使用保存最后获取的时间
  const { data, send, error, loading } = useRequest(findLastCallViewTime, {
    immediate: true,
  });
  useEffect(() => {
    // 保存到后端
  }, []);
  return { lastViewTime };
}
