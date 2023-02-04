# VoerkaLogger

适用Nodejs/Browser的通用日志输出库

[文档](https://zhangfisher.github.io/voerka-logger/)

## 主要特性

- 基于`TypeScript`开发
- 可扩展多种输出后端，包括`console/file/indexdb`等。

## 快速使用


```typescript

import { Logger } from 'voerkaLogger';
import FileBackend from 'voerkaLogger/backends/file';
import HttpBackend from 'voerkaLogger/backends/http';


let logger = new Logger({
    level:LogLevel.DEBUG,
    output:["console","file"],         // 启用的日志后端
    injectGlobal:true                  // 在globalThis注入一个logger全局变量
});

logger.use("http",new HttpBackend({}))
logger.use("file", new FileBackend({}))

 

```



## 开源推荐： 

- **`VoerkaI18n`**: [基于Nodejs/React/Vue的一键国际化解决方案](https://zhangfisher.github.io/voerka-i18n/)
- **`Logsets`**: [命令行应用增强输出库](https://zhangfisher.github.io/logsets/)
- **`AutoPub`**:  [基于pnpm/monorepo的自动发包工具](https://zhangfisher.github.io/autopub/)
- **`FlexDecorators`**:  [JavaScript/TypeScript装饰器开发库](https://zhangfisher.github.io/flex-decorators/)
- **`FlexState`**:  [有限状态机](https://zhangfisher.github.io/flexstate/)
- **`FlexTools`**:  [实用工具函数库](https://zhangfisher.github.io/flex-tools/)