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
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
export interface OperationLogProps {
    // value: any
}
export const OperationLog: React.FC<OperationLogProps> = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [loading, setLoading] = useState(true);
    const indexedDBTransport = logger.transports.indexedDb as any;
    //清空日志
    const clearLogs = async () => {
        await indexedDBTransport.clear();
        loadLogs(currentPage, selectedLevel);
    };
    //导出数据
    const exportLogsToFile = async () => {
        await indexedDBTransport.exportLogsToFile({
            page: currentPage,
            pageSize,
            level: selectedLevel,
        });
    };
    // 加载日志
    const loadLogs = async (page: number, level = '') => {
        setLoading(true);
        const res = await indexedDBTransport.getLogsPaginated({
            page: page,
            pageSize: pageSize,
            level: level,
        });
        if (res && res.data) {
            setTotalPages(res.totalPages);
            setLogs(res.data);
        }
        setLoading(false);
    };
    useEffect(() => {
        loadLogs(currentPage, selectedLevel);
    }, [currentPage, selectedLevel]);

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'INFO':
                return <Info className="w-5 h-5 text-blue-500" />;
            case 'WARN':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'ERROR':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };
    const getLevelColor = (level: string) => {
        switch (level) {
            case 'INFO':
                return 'bg-blue-100 text-blue-800';
            case 'WARN':
                return 'bg-yellow-100 text-yellow-800';
            case 'ERROR':
                return 'bg-red-100 hover:bg-red-200 hover:text-red-900 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (
        <div className="max-w-4xl p-4 mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">日志管理器</h1>
                <div className="space-x-2">
                    <select
                        className="p-2 border rounded"
                        value={selectedLevel}
                        onChange={(e) => {
                            setSelectedLevel(e.target.value);
                            setCurrentPage(1);
                        }}>
                        <option value="">全部</option>
                        <option value="INFO">信息</option>
                        <option value="WARN">警告</option>
                        <option value="ERROR">错误</option>
                        <option value="DEBUG">调试</option>
                    </select>
                    <button
                        onClick={exportLogsToFile}
                        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                        导出当前页数据
                    </button>
                    <button
                        onClick={clearLogs}
                        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                        清空日志
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-4 text-center">加载中...</div>
            ) : (
                <>
                    <div className="space-y-2">
                        {logs.length > 0 &&
                            logs.map((log) => (
                                <div
                                    key={log.id}
                                    className={`p-4 rounded-lg flex items-center space-x-3 ${getLevelColor(
                                        log.level,
                                    )}`}>
                                    {getLevelIcon(log.level)}
                                    <div>
                                        <div className="flex items-center justify-start text-sm opacity-75">
                                            <span>模块：{log.module}</span>
                                            <span>级别：{log.level}</span>
                                            <span>日期：{log.created}</span>
                                        </div>
                                        <div className="font-medium">消息：{log.message}</div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="flex justify-center mt-4 space-x-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded disabled:opacity-50">
                            上一页
                        </button>
                        <span className="px-4 py-2">
                            第 {currentPage} 页，共 {totalPages} 页
                        </span>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded disabled:opacity-50">
                            下一页
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// 默认导出
export default OperationLog;
