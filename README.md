# VoerkaLogger

适用Nodejs/Browser的通用日志输出库

[文档](https://zhangfisher.github.io/voerka-logger/)

## 主要特性

- 基于`TypeScript`开发
- 可扩展多种输出后端，包括`console/file`等。

## 快速使用


```typescript

import { Logger } from '@voerkaLogger/core';
import FileTransport from '@voerkaLogger/ile';
import HttpTransport from '@voerkaLogger/http';


let logger = new VoerkaLogger()

// 启用文件输出传输
logger.use("file",new FileTransport({
    compress: false,
    maxSize: "10k",
    maxFileCount: 5
}) as unknown as TransportBase )
 
logger.error("程序出错{}",new TypeError("数据类型出错"))
logger.info("应用启动完毕，耗时{s}s",123)
logger.debug("打开程序{#red a}{b}",{a:1,b:2})
logger.debug("打开程序{a}{b}",{a:1,b:2},{module:"switch",tags:["light","color"]})
logger.debug("打开程序{a}{b}",{a:1,b:2},{module:"switch"})
logger.warn("中华人民共和国{}{}{}",['繁荣','富强','昌盛'])
logger.warn("中华人民共和国{a}{b}{c}",{a:'繁荣',b:'富强',c:'昌盛'})
logger.error("程序{}出现致命错误:{}",["MyApp","无法加载应用"])
logger.fatal("程序{}出现致命错误:{}",["MyApp","无法加载应用"])
 
```



## 开源推荐： 

- **`VoerkaI18n`**: [基于Nodejs/React/Vue的一键国际化解决方案](https://zhangfisher.github.io/voerka-i18n/)
- **`Logsets`**: [命令行应用增强输出库](https://zhangfisher.github.io/logsets/)
- **`AutoPub`**:  [基于pnpm/monorepo的自动发包工具](https://zhangfisher.github.io/autopub/)
- **`FlexDecorators`**:  [JavaScript/TypeScript装饰器开发库](https://zhangfisher.github.io/flex-decorators/)
- **`FlexState`**:  [有限状态机](https://zhangfisher.github.io/flexstate/)
- **`FlexTools`**:  [实用工具函数库](https://zhangfisher.github.io/flex-tools/)