# 1.0.0 (2023-05-08)


### Bug Fixes

* 优化引入`flex-tools` ([55dd4c4](https://gitee.com/zhangfisher/voerkalogger/commits/55dd4c4df9a497d7c290937dd48e578f519d3662))
* **core,console-transport:** 调整`enable`属性对控制台的输出 ([341f1ac](https://gitee.com/zhangfisher/voerkalogger/commits/341f1acf4a010028566d658b6f3a8ccf31fa0d8c))
* **core,console-transport:** 调整参数并优化文档说明 ([7ea64b4](https://gitee.com/zhangfisher/voerkalogger/commits/7ea64b49e884e6be2f13573759fb127a95c81510))
* **core,console-transport:** 修复enable导致的延迟输出功能 ([2083cad](https://gitee.com/zhangfisher/voerkalogger/commits/2083cad52546efee1fa8fb4d0df73ac2a644e0ac))
* **core:** 解决enabled=false时的延迟输出问题 ([2d449ab](https://gitee.com/zhangfisher/voerkalogger/commits/2d449aba98be508e82cd055a6d27c8a52a0dcfc7))


### Features

* **console-transport:** 新增加适用于nodejs的增强控制台输出transport ([b1288f5](https://gitee.com/zhangfisher/voerkalogger/commits/b1288f5cb26c0d38b68f91089088a8c019437fcf))
* **core,console-transport:** 更新延迟输出机制 ([aeae2e9](https://gitee.com/zhangfisher/voerkalogger/commits/aeae2e9df51a29925ea2ec55d40a0ed5e994278d))
* **core:** `logger.level`现在支持使用数字或大小写无关的字符串来配置 ([1b80819](https://gitee.com/zhangfisher/voerkalogger/commits/1b80819c765c99947c5297d1563375129e1e2b12))
* **core:** 调整`enabled`属性行行为，当`enabled=false`时会先输出到缓冲区 ([b048aad](https://gitee.com/zhangfisher/voerkalogger/commits/b048aad04b767d0e6913aa75b9cecb3fca81c956))
* **core:** 调整日志输出策略 ([e8d0805](https://gitee.com/zhangfisher/voerkalogger/commits/e8d0805caa64bebc532cba22e023436dbc94f109))
* **core:** 调整实例创建模式,import时不再默认创建实例 ([69d50c9](https://gitee.com/zhangfisher/voerkalogger/commits/69d50c94ef53d5192eebbd5d0a6c7a918dec648c))
* **core:** 默认自动创建日志实例 ([bce2110](https://gitee.com/zhangfisher/voerkalogger/commits/bce211087898c57ace5db3b3995e07d1d60e87bd))
* **file-backend:** 更新文件名称生成策略 ([2d99c38](https://gitee.com/zhangfisher/voerkalogger/commits/2d99c3862ddb8f616e717a5ea95584986bcf3a95))
* **file-backend:** 构建FileBackend ([5470862](https://gitee.com/zhangfisher/voerkalogger/commits/54708623f5e7e7e362de6fac07b4b90328d99b31))
* **log:** fdfdfdf ([fb93ea3](https://gitee.com/zhangfisher/voerkalogger/commits/fb93ea3812907ea2099970d3b1774cd09ad8f9ee))



