import {
  TransportBaseOptions,
  TransportBase,
  TransportOptions,
  DefaultFormatTemplate,
  LogMethodVars,
  VoerkaLoggerRecord,
} from "@voerkalogger/core";
import { assignObject } from "flex-tools/object/assignObject";
import { createStorage } from "unstorage";
import "idb-keyval";
import indexedDbDriver from "unstorage/drivers/indexedb";

export type IndexedDbOptions<Output> = TransportBaseOptions<Output> & {
  // 可以在这里添加一些特定的选项，例如存储库的名称等
  dbName?: string;
  maxFileCount?: number;
};

export default class IndexedDbTransport<Output = string> extends TransportBase<
  IndexedDbOptions<Output>
> {
  #storage: any;
  constructor(options?: TransportOptions<IndexedDbOptions<Output>>) {
    super(
      assignObject(
        {
          dbName: "voerkalogger",
          maxFileCount: 50,
        },
        options
      )
    );
    this.initDB();
  }
  //格式化结构
  format(record: VoerkaLoggerRecord, interpVars: LogMethodVars): any {
    try {
      const vars: Record<string, any> = {
        ...this.getInterpVars(record),
        ...record,
      };
      return vars;
    } catch (e: any) {
      console.error(e.stack);
    }
  }
  async output(result: any[]) {
    //判断是否已初始化indexedDb数据库
    if (this.#storage) {
      //判断日志是否已满，如果超过限制数量，则删除旧数据
      await this.cleanupOldLogs();
      //将新数据写入库中
      for (let item of result) {
        await this.addLog({
          level: item.levelName.replace(/[\s\r\n]+/g, ""),
          message: item.message,
          created: item.datetime,
          module: item.module,
        });
      }
    }
  }

  //获取全部日志类型
  async getType() {
    return ["info", "warn", "debug", "fatal", "error"];
  }
  // 初始化存储
  async initDB() {
    // 创建存储实例，使用 IndexedDB 作为适配器
    this.#storage = createStorage({
      driver: indexedDbDriver({ base: `${this.options.dbName}::` }), // 指定数据库名称前缀
    });

    // 检查是否已经初始化
    const isInitialized = await this.#storage.hasItem("logs::initialized");
    if (!isInitialized) {
      // 初始化日志存储结构
      await this.#storage.setItem("logs::initialized", true);
      // 创建日志索引
      await this.#storage.setItem("logs::index::level", {});
      await this.#storage.setItem("logs::index::timestamp", {});
      console.log("LoggerDB initialized with unstorage");
    }
  }

  // 添加日志
  async addLog(log: {
    level: string;
    message: string;
    created: string;
    module: string;
  }) {
    // 生成唯一 ID
    const logId = `logs::${Date.now()}::${Math.random().toString(36).slice(2)}`;
    // 构造日志对象
    const logData = {
      id: logId, // 唯一编号
      level: log.level, // 级别
      message: log.message, // 消息内容
      created: log.created, // 创建时间
      module: log.module ? log.module : "APP", // 模块名称
    };
    // 存储日志数据
    await this.#storage.setItem(`logs:data::${logId}`, logData);
    // 更新索引
    await this.updateIndex("level", log.level, logId);
    await this.updateIndex("timestamp", log.created, logId);
  }

  // 更新索引
  private async updateIndex(indexName: string, indexValue: string, logId: string) {
    const indexKey = `logs::index::${indexName}::${indexValue}`;
    const index = (await this.#storage.getItem(indexKey)) || [];
    index.push(logId);
    await this.#storage.setItem(indexKey, index);
  }
  getLogs(query: any) {
    return this.getLogsPaginated(query);
  }
  // 分页查询日志
  private async getLogsPaginated({
    page = 1,
    pageSize = 10,
    level = "",
  }: {
    page: number;
    pageSize: number;
    level: string;
  }) {
    // 获取所有日志的键名
    const keys = await this.#storage.getKeys(
      `${this.options.dbName}:::logs:data::`
    );
    // 修复键名（如果冒号被合并）
    const fixedKeys = keys.map((key: any) =>
      key.replace(`${this.options.dbName}:`, "")
    );
    // 获取所有日志数据
    const logs = await Promise.all(
      fixedKeys.map(async (key: any) => {
        const data = await this.#storage.getItem(key);
        return data;
      })
    );
    // 过滤无效数据
    const validLogs = logs.filter(Boolean);
    // 根据日志级别过滤数据
    let filteredLogs: VoerkaLoggerRecord[];
    if (level == "") {
      filteredLogs = validLogs; // 返回所有日志
    } else {
      filteredLogs = validLogs.filter((log) => log.level === level);
    }
    // 按创建时间降序排序
    const sortedLogs = filteredLogs.sort((a, b) =>
      b.created.localeCompare(a.created)
    );
    // 计算分页范围
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedLogs = sortedLogs.slice(start, end);
    return {
      data: paginatedLogs,
      total: sortedLogs.length,
      totalPages: Math.ceil(sortedLogs.length / pageSize),
      page,
      pageSize,
    };
  }
  /**
   * 清理超出数量限制的旧日志
   */
  private async cleanupOldLogs() {
    // 获取所有日志键名
    const keys = await this.#storage.getKeys(
      `${this.options.dbName}:::logs:data::`
    );
    // 未超过限制则直接返回
    if (keys.length <= this.options.maxFileCount) return;
    // 修复键名（如果冒号被合并）
    const fixedKeys = keys.map((key: any) =>
      key.replace(`${this.options.dbName}:`, "")
    );
    // 获取所有日志数据
    const logs = await Promise.all(
      fixedKeys.map(async (key: any) => await this.#storage.getItem(key))
    );
    // 过滤无效数据并按时间升序排序（旧日志在前）
    const validLogs = logs.filter(Boolean);
    const sortedLogs = validLogs.sort((a, b) =>
      a.created.localeCompare(b.created)
    );
    // 计算需要删除的数量
    const deleteCount = sortedLogs.length - this.options.maxFileCount;
    const logsToDelete = sortedLogs.slice(0, deleteCount);
    // 删除旧日志及其索引
    await Promise.all(
      logsToDelete.map(async (log) => {
        // 删除日志数据
        const key = `logs:data:${log.id}`;
        await this.#storage.removeItem(key);
        // 从索引中移除日志 ID
        await this.removeFromIndex("level", log.level, log.id);
        await this.removeFromIndex("timestamp", log.created, log.id);
      })
    );
    console.log(`Deleted ${deleteCount} old logs`);
  }
  /**
   * 从索引中移除指定日志 ID
   */
  private async removeFromIndex(indexName: string, indexValue: string, logId: string) {
    const indexKey = `logs::index::${indexName}::${indexValue}`;
    const index = (await this.#storage.getItem(indexKey)) || [];
    const updatedIndex = index.filter((id: string) => id !== logId);
    if (updatedIndex.length > 0) {
      await this.#storage.setItem(indexKey, updatedIndex);
    } else {
      // 如果索引为空，直接删除该索引键
      await this.#storage.removeItem(indexKey);
    }
  }

  /**
   * 导出指定页码的日志数据
   * @param page 页码
   * @param pageSize 每页大小
   */
  async exportLogsPaginated({
    page = 1,
    pageSize = 10,
    level = "",
  }: {
    page: number;
    pageSize: number;
    level: string;
  }): Promise<string> {
    // 获取分页日志数据
    const { data, total } = await this.getLogsPaginated({
      page,
      pageSize,
      level,
    });
    // 构造导出的数据对象
    const exportData = {
      metadata: {
        page,
        pageSize,
        total,
        timestamp: new Date().toISOString(),
      },
      logs: data,
    };
    // 将数据转换为 JSON 格式
    const exportJson = JSON.stringify(exportData, null, 2);
    return exportJson;
  }
  /**
   * 将日志数据导出为文件
   * @param page 页码
   * @param pageSize 每页大小
   */
  async exportLogsToFile({
    page = 1,
    pageSize = this.options.maxFileCount,
    level = "",
  }: {
    page: number;
    pageSize: number;
    level: string;
  }): Promise<void> {
    const exportJson = await this.exportLogsPaginated({
      page,
      pageSize,
      level,
    });
    // 创建 Blob 对象
    const blob = new Blob([exportJson], { type: "application/json" });
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs_page_${page}.json`;
    a.click();
    // 释放对象 URL
    URL.revokeObjectURL(url);
  }
  /**
   * 清空所有日志数据和索引
   */
  async clear() {
    // 获取所有日志数据的键名
    const logKeys = await this.#storage.getKeys(
      `${this.options.dbName}:::logs:data::`
    );
    const fixedLogKeys = logKeys.map((key: any) =>
      key.replace(`${this.options.dbName}:`, "")
    );
    // 获取所有索引的键名
    const indexKeys = await this.#storage.getKeys(
      `${this.options.dbName}:::logs::index::`
    );
    const fixedIndexKeys = indexKeys.map((key: any) =>
      key.replace(`${this.options.dbName}:`, "")
    );
    // 删除所有日志数据
    await Promise.all(
      fixedLogKeys.map((key: any) => this.#storage.removeItem(key))
    );
    // 删除所有索引
    await Promise.all(
      fixedIndexKeys.map((key: any) => this.#storage.removeItem(key))
    );
    // 删除初始化标记（可选，根据需要决定是否保留）
    await this.#storage.removeItem("logs::initialized");
    console.log("All logs and indexes have been cleared.");
  }
}
