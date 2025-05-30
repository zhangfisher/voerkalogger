import React, { useState, useEffect } from "react";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

// 创建和初始化 IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("LoggerDB", 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("logs")) {
        const store = db.createObjectStore("logs", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("level", "level");
        store.createIndex("timestamp", "timestamp");
      }
    };
  });
};

const LogManager = () => {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const logsPerPage = 10;

  // 添加日志
  const addLog = async (level, message) => {
    const db = await initDB();
    const transaction = db.transaction(["logs"], "readwrite");
    const store = transaction.objectStore("logs");

    await store.add({
      level,
      message,
      timestamp: new Date().toISOString(),
    });

    loadLogs(currentPage, selectedLevel);
  };

  // 加载日志
  const loadLogs = async (page, level = "ALL") => {
    setLoading(true);
    const db = await initDB();
    const transaction = db.transaction(["logs"], "readonly");
    const store = transaction.objectStore("logs");

    let allLogs = [];

    // 获取所有日志
    await new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => {
        allLogs = request.result;
        resolve();
      };
    });

    // 过滤和排序
    if (level !== "ALL") {
      allLogs = allLogs.filter((log) => log.level === level);
    }

    allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // 计算分页
    const total = Math.ceil(allLogs.length / logsPerPage);
    setTotalPages(total);

    // 获取当前页的日志
    const start = (page - 1) * logsPerPage;
    const end = start + logsPerPage;
    setLogs(allLogs.slice(start, end));
    setLoading(false);
  };

  useEffect(() => {
    loadLogs(currentPage, selectedLevel);
  }, [currentPage, selectedLevel]);

  // 测试数据生成
  const generateTestData = async () => {
    const levels = ["INFO", "WARNING", "ERROR"];
    const messages = [
      "系统启动成功",
      "用户登录",
      "数据同步完成",
      "网络连接超时",
      "数据库查询失败",
      "内存使用过高",
    ];

    for (let i = 0; i < 50; i++) {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      await addLog(level, message);
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "INFO":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "ERROR":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "INFO":
        return "bg-blue-100 text-blue-800";
      case "WARNING":
        return "bg-yellow-100 text-yellow-800";
      case "ERROR":
        return "bg-red-100 text-red-800";
      default:
        return "";
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
            }}
          >
            <option value="ALL">全部</option>
            <option value="INFO">信息</option>
            <option value="WARNING">警告</option>
            <option value="ERROR">错误</option>
          </select>
          <button
            onClick={generateTestData}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            生成测试数据
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-4 text-center">加载中...</div>
      ) : (
        <>
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-lg flex items-center space-x-3 ${getLevelColor(
                  log.level
                )}`}
              >
                {getLevelIcon(log.level)}
                <div className="flex-1">
                  <div className="font-medium">{log.message}</div>
                  <div className="text-sm opacity-75">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-4 py-2">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LogManager;
