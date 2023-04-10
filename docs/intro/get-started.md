# 快速入门

## 第1步：创建日志器实例

```typescript
import "@voerkalogger/core";

```
- 直接导入`@voerkalogger/core`模块即可创建一个全局日志器实例`logger`。
- 在应用中可以直接使用`logger`进行日志输出。
- `VoerkaLogger`默认启用了`console`控制台日志输出。

## 第2步：安装可选的日志`Transport`

`Transport`负责将日志输出到各种不同的目标，如`文件系统`、`HTTP服务器`、`syslog`、`sentry`等.

目前`VoerkaLogger`已经内置了`file`、`http`两个日志`Transport`。

```typescript

import FileTransport from "@voerkalogger/file"
import HttpTransport from "@voerkalogger/http"

// 安装FileTransport
logger.use("file",new FileTransport({
    compress: false,
    maxSize: "10k",
    maxFileCount: 5
}) as unknown as TransportBase )

// 安装HttpTransport 
logger.use("http",new HttpTransport<HttpOutputType>({
    url:"http://192.168.1.2/log"
}) as unknown as TransportBase)

```

## 第3步：使用日志输出

默认情况下，`VoerkaLogger`启用了一个全局变量`logger`，这样就可在所有模块中直接使用进行日志输出。

`VoerkaLogger`将日志划分为5个级别，即`DEBUG` < `INFO` < `WARN` < `ERROR` < `FATAL`。

```typescript
// 直接启用全局变量即可。

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

输出结果如下：

![](./log1.png)



