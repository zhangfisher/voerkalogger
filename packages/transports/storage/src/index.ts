import { TransportBase, TransportBaseOptions, TransportOptions, VoerkaLoggerLevelName, VoerkaLoggerLevelNames, VoerkaLoggerRecord } from '@voerkalogger/core';
import { delay } from 'flex-tools/async/delay';
import { assignObject } from 'flex-tools/object/assignObject';
import localForage from 'localforage';

export type StorageTransportOptions<VoerkaLoggerRecord> = TransportBaseOptions<VoerkaLoggerRecord> & {
    driver: 'auto' | 'IndexedDB' | 'WebSQL' | 'localStorage';
    appName?: string;
    storeName?: string;
    maxCount?: number;
};

export type StorageTransportVoerkaLoggerRecord = string;

export type StorageTransportQuery = {
    page?: number;
    pageSize?: number;
    levels?: string | string[];
    sort: 'asc' | 'desc';
};
export type StorageTransportQueryFilter = (record: VoerkaLoggerRecord) => boolean;

export type StorageTransportLogMeta = {
    beginIndex: number; // 起始日志索引
    endIndex: number; // 结束日志索引
};

export default class StorageTransport extends TransportBase<StorageTransportOptions<VoerkaLoggerRecord>> {
    private _storage?: LocalForage;
    constructor(options?: TransportOptions<StorageTransportOptions<VoerkaLoggerRecord>>) {
        super(
            assignObject(
                {
                    driver: 'auto',
                    appName: 'voerka',
                    storeName: 'voerkalogs',
                    maxCount: 1000, // 最大日志数量
                },
                options,
            ) as TransportOptions<StorageTransportOptions<VoerkaLoggerRecord>>,
        );
        this._initStorage();
    }
    get storage() {
        return this._storage!;
    }

    isAvailable() {
        return !!this._storage;
    }

    private async _initMeta() {
        const meta = await this.storage.getItem<StorageTransportLogMeta>('meta');
        if (!meta) {
            await this.storage.setItem('meta', {
                beginIndex: 0,
                endIndex: 0,
            });
        }
    }
    private async _getMeta() {
        let meta: StorageTransportLogMeta = {
            beginIndex: 0,
            endIndex: 0,
        };
        try {
            let data = await this.storage.getItem<StorageTransportLogMeta>('meta');
            if (data) {
                meta = data;
            }
        } catch (e: any) {
            this.logger?.error(e.stack);
        }
        return meta;
    }

    private async _initStorage() {
        try {
            const opts = {
                name: this.options.appName,
                storeName: this.options.storeName,
            };

            this._storage = localForage.createInstance(opts);
            this._initMeta();
        } catch (e: any) {
            this.logger?.error(e.stack);
        }
    }

    format(record: VoerkaLoggerRecord): any {
        return record;
    }

    private async _releaselock() {
        await this.storage.removeItem('_locking');
    }

    private async _acquireLock() {
        const timeout = 5000; // 5 seconds timeout
        const interval = 100; // check every 100ms
        let elapsed = 0;
        while (elapsed < timeout) {
            const writing = await this.storage.getItem<boolean>('_locking');
            if (!writing) break;
            await delay(interval);
            elapsed += interval;
        }
        await this.storage.setItem('_locking', true);
    }

    async output(items: VoerkaLoggerRecord[]) {
        if (!this.isAvailable()) return;
        const meta = await this._getMeta();
        try {
            await this._acquireLock();
            await Promise.all(
                items.map(async (item, index) => {
                    // @ts-ignore
                    item.id = `${meta.endIndex + index}`;
                    await this.storage.setItem(`${meta.endIndex + index}`, item);
                    meta.endIndex++;
                }),
            );
            this._updateIndex(items);
        } finally {
            await this.storage.setItem('meta', meta);
            await this._clearExpiredLogs();
            this._releaselock();
        }
    }

    private async _updateIndex(items: VoerkaLoggerRecord[]) {
        type LogLevelIndexes = Record<VoerkaLoggerLevelName, any[]>;

        let oldIndex: LogLevelIndexes | null = await this.storage.getItem(`_level_indexes`);

        let levelIndex: LogLevelIndexes = oldIndex
            ? oldIndex
            : ({
                  NOTSET: [],
                  DEBUG: [],
                  INFO: [],
                  WARN: [],
                  ERROR: [],
                  FATAL: [],
              } as LogLevelIndexes);

        for (let item of items) {
            const levelName = VoerkaLoggerLevelNames[item.level] as VoerkaLoggerLevelName;
            if (!levelIndex[levelName]) levelIndex[levelName] = [];
            levelIndex[levelName].push(item.id);
        }
        await this.storage.setItem(`_level_indexes`, levelIndex);
    }

    private async _clearExpiredLogs() {
        const meta = await this._getMeta();
        const { beginIndex, endIndex } = meta;
        const maxCount = this.options.maxCount;
        if (endIndex - beginIndex > maxCount) {
            // 计算需要删除的日志数量
            const removeCount = endIndex - beginIndex - maxCount;
            const removeKeys = createArray(beginIndex, removeCount).map((i) => `${i}`);

            // 更新级别索引
            const levelIndexes = await this.storage.getItem<Record<VoerkaLoggerLevelName, string[]>>('_level_indexes');
            if (levelIndexes) {
                // 从每个级别的索引中移除已删除的日志ID
                Object.keys(levelIndexes).forEach((level) => {
                    levelIndexes[level as VoerkaLoggerLevelName] = levelIndexes[level as VoerkaLoggerLevelName].filter((id) => !removeKeys.includes(id));
                });
                await this.storage.setItem('_level_indexes', levelIndexes);
            }

            // 删除日志记录
            await Promise.all(
                removeKeys.map(async (key) => {
                    await this.storage.removeItem(key);
                }),
            );

            // 更新元数据
            meta.beginIndex = meta.beginIndex + removeCount;
            await this.storage.setItem('meta', meta);
        }
    }

    /**
     *
     * getLogs({
     *     page:1,pageSize:10,
     *     sort:"desc" | 'asc' ,
     *     levels:['DEBUG',"INFO"],
     *     modules:['a','b'],
     * )})
     *
     * getLogs(record=>record.message.includes('xssss'))
     *
     * @param query
     * @returns
     */
    async getLogs(query: StorageTransportQuery | StorageTransportQueryFilter): Promise<VoerkaLoggerRecord[]> {
        if (!this.isAvailable()) return [];

        if (typeof query == 'function') {
            const { beginIndex, endIndex } = await this._getMeta();
            const keys = createArray(beginIndex, endIndex - beginIndex).map((i) => `${i}`);
            const results: VoerkaLoggerRecord[] = [];
            for (let key of keys) {
                const record = await this.storage.getItem<VoerkaLoggerRecord>(key);
                if (record && query(record)) {
                    results.push(record);
                }
            }
            return results;
        } else {
            const { sort = 'desc', page = 1, pageSize = 10, levels = [] } = query;
            const { beginIndex, endIndex } = await this._getMeta();
            // 获取日志ID列表
            let logIds: string[] = [];
            if (levels && levels.length > 0) {
                // 按级别过滤
                const levelIndexes = await this.storage.getItem<Record<VoerkaLoggerLevelName, string[]>>('_level_indexes');
                if (levelIndexes) {
                    const lvs = Array.isArray(levels) ? levels : [levels];
                    logIds = lvs
                        .reduce((prev, level) => {
                            return prev.concat(levelIndexes[level.toUpperCase() as VoerkaLoggerLevelName] || []);
                        }, [] as string[])
                        .filter((id) => parseInt(id, 10) >= beginIndex && parseInt(id, 10) <= endIndex);
                }
            } else {
                // 获取所有日志
                logIds = createArray(beginIndex, endIndex - beginIndex).map((i) => `${i}`);
            }

            // 排序
            logIds.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

            if (sort === 'desc') {
                logIds.reverse();
            }

            // 分页
            if (page > 0 && pageSize > 0) {
                const start = (page - 1) * pageSize;
                logIds = logIds.slice(start, start + pageSize);
            }

            // 获取日志内容
            const logs = await Promise.all(
                logIds.map(async (id) => {
                    return await this.storage.getItem<VoerkaLoggerRecord>(id);
                }),
            );

            return logs.filter((log) => log !== null) as VoerkaLoggerRecord[];
        }
    }

    async getCount(query?: Pick<StorageTransportQuery, 'levels'>): Promise<number> {
        if (!this.isAvailable()) return 0;

        const { beginIndex, endIndex } = await this._getMeta();

        if (!query?.levels || !query.levels.length) {
            return endIndex - beginIndex;
        }

        // 按级别统计
        const levelIndexes = await this.storage.getItem<Record<VoerkaLoggerLevelName, string[]>>('_level_indexes');
        if (!levelIndexes) return 0;

        const levels = Array.isArray(query.levels) ? query.levels : [query.levels];
        return levels.reduce((count, level) => {
            const levelLogs = levelIndexes[level.toUpperCase() as VoerkaLoggerLevelName].filter((i) => parseInt(i, 10) >= beginIndex && parseInt(i, 10) <= endIndex) || [];
            return count + levelLogs.length;
        }, 0);
    }

    async clear() {
        return this.storage.clear();
    }

    destroy(): void {
        this.storage.dropInstance();
    }
}

export function createArray(startIndex: number, length: number) {
    return Array.from({ length }, (v, i) => i + startIndex);
}
