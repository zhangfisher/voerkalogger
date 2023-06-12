# 1.0.0 (2023-06-12)


### Bug Fixes

* 更新控制台输出机制 ([0c1e13f](https://gitee.com/zhangfisher/voerkalogger/commits/0c1e13f2ecfe849de862c98cf7cbc8aeeec8a66e))
* 修复控制台着色输出问题 ([a6811f4](https://gitee.com/zhangfisher/voerkalogger/commits/a6811f41d2dbb9bc58c2664436ed121e8bd7d9d6))
* 修改`format`参数中的插值变量替换机制 ([60b20fc](https://gitee.com/zhangfisher/voerkalogger/commits/60b20fc21273da8308d0f7b6d1461535e677b4cb))
* 移除packages/transports/console ([224f2e8](https://gitee.com/zhangfisher/voerkalogger/commits/224f2e87a0ded2ecb5726c0cd01cc43fe1108450))
* 优化引入`flex-tools` ([55dd4c4](https://gitee.com/zhangfisher/voerkalogger/commits/55dd4c4df9a497d7c290937dd48e578f519d3662))
* **core,console-transport:** 调整`enable`属性对控制台的输出 ([341f1ac](https://gitee.com/zhangfisher/voerkalogger/commits/341f1acf4a010028566d658b6f3a8ccf31fa0d8c))
* **core,console-transport:** 调整参数并优化文档说明 ([7ea64b4](https://gitee.com/zhangfisher/voerkalogger/commits/7ea64b49e884e6be2f13573759fb127a95c81510))
* **core,console-transport:** 修复enable导致的延迟输出功能 ([2083cad](https://gitee.com/zhangfisher/voerkalogger/commits/2083cad52546efee1fa8fb4d0df73ac2a644e0ac))
* **core:** 解决未导出VoerkaLoggerScope的问题 ([d79085a](https://gitee.com/zhangfisher/voerkalogger/commits/d79085acd248f81b08e1ac9e9639e06f427e4efc))
* **core:** 解决enabled=false时的延迟输出问题 ([2d449ab](https://gitee.com/zhangfisher/voerkalogger/commits/2d449aba98be508e82cd055a6d27c8a52a0dcfc7))
* **core:** 修复`destory`时执行`flush`逻辑 ([f20d6ec](https://gitee.com/zhangfisher/voerkalogger/commits/f20d6ecb4186e1a30c75f85b01f51edb5fd9b4b3))
* **core:** 修复`VoerkaLoggerScopeOptions`类型冲突 ([40964c8](https://gitee.com/zhangfisher/voerkalogger/commits/40964c8e1dc089310c0d44b9f07801f53553fc06))
* **core:** 修复延迟输出不能正常工作的问题 ([5f9ea6d](https://gitee.com/zhangfisher/voerkalogger/commits/5f9ea6d2191ded55f1acaa198aaae523e14655d5))


### Features

* 增加transport的`available`属性用来标识是否可用 ([66e4939](https://gitee.com/zhangfisher/voerkalogger/commits/66e49392d26c92e9c3ccfd2debab3b5bab6b57a6))
* **console-transport:** 新增加适用于nodejs的增强控制台输出transport ([b1288f5](https://gitee.com/zhangfisher/voerkalogger/commits/b1288f5cb26c0d38b68f91089088a8c019437fcf))
* **core,console-transport:** 更新延迟输出机制 ([aeae2e9](https://gitee.com/zhangfisher/voerkalogger/commits/aeae2e9df51a29925ea2ec55d40a0ed5e994278d))
* **core:** `logger.level`现在支持使用数字或大小写无关的字符串来配置 ([1b80819](https://gitee.com/zhangfisher/voerkalogger/commits/1b80819c765c99947c5297d1563375129e1e2b12))
* **core:** `logger.options.output`构建时可以使用`console,file`形式的参数，内部转换为['console','file']数组 ([2711c23](https://gitee.com/zhangfisher/voerkalogger/commits/2711c233753fe71a073fbe3f8d1bd926cf509e09))
* **core:** 调整`enabled`属性行行为，当`enabled=false`时会先输出到缓冲区 ([b048aad](https://gitee.com/zhangfisher/voerkalogger/commits/b048aad04b767d0e6913aa75b9cecb3fca81c956))
* **core:** 调整日志输出策略 ([e8d0805](https://gitee.com/zhangfisher/voerkalogger/commits/e8d0805caa64bebc532cba22e023436dbc94f109))
* **core:** 调整实例创建模式,import时不再默认创建实例 ([69d50c9](https://gitee.com/zhangfisher/voerkalogger/commits/69d50c94ef53d5192eebbd5d0a6c7a918dec648c))
* **core:** 默认自动创建日志实例 ([bce2110](https://gitee.com/zhangfisher/voerkalogger/commits/bce211087898c57ace5db3b3995e07d1d60e87bd))
* **core:** 升级内置的consoleTransport，支持着色输出 ([ae31829](https://gitee.com/zhangfisher/voerkalogger/commits/ae318292e87b24d761b14140236469c67dd49e90))
* **core:** 新增加levelName用来返回当前级别名称 ([02b1676](https://gitee.com/zhangfisher/voerkalogger/commits/02b1676ae36ccb2ba3091c2170b27ce13f0350e1))
* **core:** 优化配置更新时的容错处理 ([15c7849](https://gitee.com/zhangfisher/voerkalogger/commits/15c7849bc71c432be09ec1709c651624723603eb))
* **core:** 支持通过`logger.options={...}`对配置进行局部更新 ([48e7d99](https://gitee.com/zhangfisher/voerkalogger/commits/48e7d997c96e08caaf6ebe304c186e9baf4e5408))
* **core:** LoggerScope现在允许单独指定level ([7cdcb61](https://gitee.com/zhangfisher/voerkalogger/commits/7cdcb61096cfff194a0b3964ab762586d6cbf045))
* **file-backend:** 更新文件名称生成策略 ([2d99c38](https://gitee.com/zhangfisher/voerkalogger/commits/2d99c3862ddb8f616e717a5ea95584986bcf3a95))
* **file-backend:** 构建FileBackend ([5470862](https://gitee.com/zhangfisher/voerkalogger/commits/54708623f5e7e7e362de6fac07b4b90328d99b31))
* **log:** fdfdfdf ([fb93ea3](https://gitee.com/zhangfisher/voerkalogger/commits/fb93ea3812907ea2099970d3b1774cd09ad8f9ee))



