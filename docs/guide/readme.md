# 指南

## 创建日志实例

```typescript
import { VoerkaLogger, VoerkaLoggerLevel,TransportBase } from "@voerkalogger/core";

let logger = new VoerkaLogger({
    id?: string                                 // 当前应用ID
    enabled?:boolean                            // 全局开关
    scope?: VoerkaLoggerScope                   // 用来标识当前应用，如设备所在的IP地址，或者用户名称等
    level?:VoerkaLoggerLevel                    // 全局日志级别
    debug?:boolean                              // 是否在调试阶段，=true时所有日志均会输出
    output?: string[]                           // 启用的输出后端
    context?:Record<string,any> | null                  // 全局上下文，可以用为输出时的插值变量，同时会被合并到VoerkaLoggerRecord中
    injectGlobal?:boolean | string                      // 注入一个全局的logger变量名称
    catchGlobalErrors?: boolean                         // 是否捕获全局错误
    tags?:string[]                                 
})

```

## 引用日志实例

- `VoerkaLogger`采用单例模式设计，全局仅允许建一个实例。
- 默认情况下`injectGlobal=true`,会在全局注入一个名称为`logger`的全局变量，这样在整个应用中均可以直接使用`logger.debug`、`logger.warn`等方式进行日志输出。
- 如果默认的全局变量名称`logger`存在冲突，则可以在构建时通过`injectGlobal`来重新指定要注入的全局变量名称。如`injectGlobal="MyLogger"`，则就存在一个全局变量`MyLogger`。
- 为什么日志对象要采用全局变量形式？因为考虑到日志几乎无所不在，所以直接引入一个全局变量会更加方便。
- 如果你不喜欢污染全局变量，则可以通过配置`injectGlobal=false`来禁用此行为。


## 启用/禁用日志输出

- 通过`logger.enabled=<true/false>`可以启用或禁用所有日志输出。
- 也可以单独对启用/禁用某个`Transport`日志输出。

    ```typescript
        logger.transports.console.enabled=false   // 禁用控制器台输出
        logger.transports.file.enabled=false      // 禁用文件输出
    ```

## 日志级别

`VoerkaLogger`支持以下日志级别：

```typescript
export enum VoerkaLoggerLevel{
    NOTSET = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
}
```

所有日志级别均提供对应的方法.

## 日记输出方法

## DEBUG模式

当`debug=true`时会忽略所有日志级别设定，所有输出均以`DEBUG`级别进行输出。

## 控制台输出



## 文件输出


## HTTP输出




