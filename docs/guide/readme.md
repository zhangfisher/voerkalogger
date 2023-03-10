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

- 当调用日志输出方法时，仅会输出大于配置级别的日志，比如`logger.level==WARN`，则所有`<WARN`的日志均不会输出。
- 可以通过`logger.level`来指定日志输出级别
- 也可以为每一个日志`Transport`单独指定日志日志级别。比如`logger.transports.file.level=ERROR`。这样，我们可以为不同的`Transport`指定不同的日志级别。


## 日记输出方法

除了`NOSET`外，所有日志级别均提供对应的方法来输出日志，日志方法签名如下：

```typescript 
logger.debug(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions)
logger.info(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions)
logger.warn(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions)
logger.error(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions)
logger.fatal(message:LogMethodMessage,vars?:LogMethodVars,options?:LogMethodOptions)
```


- `message`
   日志输出信息
   类型：`string | (()=> string)`,支持字符串或返回字符串的函数
   支持通过`{}`方式定义插值变量。
   
   ```typescript
    // 位置插值
    logger.debug("{a}+{b}={c}",[1,2,3])         //  1+2=3
    logger.debug("{}+{}={}",[1,2,3])            //  1+2=3    
    // 命名插值
    logger.debug("{a}+{b}={c}",{a:1,b:2,c:3})   //  1+2=3
   ```

- `vars`
   插值变量，可以是`数组`或者`{}`。如果只有一个变量也可以是任意类型。例如：
   ```typescript
    logger.debug("{a}",1)                   // 1
    logger.debug("My name is {}","voerka")  // My name is voerka
   ```

- `options`
   配置参数
   ```typescript
   export interface LogMethodOptions{
        error?: string | Error          // 错误信息或对象
        tags?:string[]                  // 日志标签
        module?:string,                 // 应用模块名称或源文件，使用/分割
        [key: string]:any               // 额外的信息
    }
   ```
 

## 模块参数

有时我们需要在打日志时指定日志所在的文件或模块，日志输出方法均提供了一个`module`参数。

```typescript 
logger.debug("message",[],{module:"bus"})
logger.info("message",[],{module:"store"})
logger.warn("message",[],{module:"store"})
logger.error("message",[],{module:"settings"})
logger.fatal("message",[],{module:"store"})
```

## 日志作用域

为了在日志输出中指定日志所在的模块等信息，我们需要在日志输出方法时指定`module`参数或者其他参数，如下：

```typescript 
logger.debug("message",[],{module:"bus",a:1})
logger.info("message",[],{module:"store",a:1})
logger.warn("message",[],{module:"store",a:1})
logger.error("message",[],{module:"settings",a:1})
logger.fatal("message",[],{module:"store",a:1})
```

这样就造成了较多的冗余信息，此时就可以引入`日志作用域`的概念，其他日志实现也有叫子日志器的。

通过`createScope`方法创建一个独立的日志作用域。

```typescript 
// module A.ts
const aLogger = logger.createScope({module:"a",a:1,...})
aLogger.debug("message")
aLogger.info("message")
aLogger.warn("message")
aLogger.error("message")
aLogger.fatal("message")

// module B.ts
const bLogger = logger.createScope({module:"b",a:2,...})
bLogger.debug("message")
bLogger.info("message")
bLogger.warn("message")
bLogger.error("message")
bLogger.fatal("message")

// 可以创建多级scope,  
// module b/x.ts
const bxLogger = bLogger.createScope({module:"bx",a:2,...})
bxLogger.debug("message")
bxLogger.info("message")
bxLogger.warn("message")
bxLogger.error("message")
bxLogger.fatal("message")
```

## DEBUG模式

当`debug=true`时会忽略所有日志级别设定，所有输出均以`DEBUG`级别进行输出。

## 应用信息

当日志被传输到远程服务器时，一般需要提供诸如应用程序名称、IP地址、主机名等信息。`VoerkaLogger`可以通过在构建日志实例时配置`scope`参数来实现。

```typescript

const logger  = new VoerkaLogger({
    scope:{
        version?: string               // 设备或应用软件版本号   
        module?: string                // 模块名称
        app?: string                   // 应用名称
        host?: string                  // 当前主机名称，如IP地址或
        sn?: string                    // 设备序列号
    }
})
```
## 日志记录

当调用日志方法进行输出时，`VoerkaLogger`内部均会生成一个`VoerkaLoggerRecord`。

```typescript
export interface VoerkaLoggerRecord{
    message: string                             // 日志信息
    level: VoerkaLoggerLevel                    // 日志级别
    timestamp?: number                          // 时间戳
    error?: string | Error                      // 错误信息
    tags?:string[]                              // 日志标签
    module?:string,                             // 应用模块名称或源文件，使用/分割
    [key: string]:any                           // 额外的信息
}

```

- 同时构建日志实例时传入的`context`和`scope`参数也会被合并到`VoerkaLoggerRecord`。
- 如果日志输出时传入一个错误对象，也会传入`error`,`errorStack`,`errorLine`三个参数。

**完整的日志记录可能是：**

```typescript
{
    message: "日志信息",
    level: 2,                   // 日志级别
    timestamp: 45743451243,     // 时间戳
    tags:["a","c"],             // 日志标签
    module:"xxxx",              // 应用模块名称或源文件，使用/分割
    version:"1.0",
    app:"voerka",
    sn:"312a518c3dw",
    host:"zpc",
    // 如果在调用日志方法时传入error对象有错误
    error:"",
    errorStack:"",
    errorLine:441
    // ..其他额外的信息
    // ...日志方法传入的额外信息,如logger.debug(msg,var,{a:1})
    // a:1
}
```

## 日志缓冲区

每个`Transport`内部均具有一个输出缓冲区，当调用日志输出方法时，会先保存到该缓冲区，然后等缓冲区满或超过指定时间间隔时会调用`Transport.output`方法执行输出操作。

**缓冲区控制参数：**

```typescript
logger.use("file",new FileTransport({
    bufferSize:10,          // 默认是保存10条记录
    flushInterval:10 * 1000 ,       // 每隔10秒执行一次输出
}) as unknown as TransportBase )
```

- 当缓冲区的日志记录超出`bufferSize`时马上执行输出，`bufferSize`默认值是`10`
-  每隔`flushInterval`时间执行一次输出，不论缓冲区是否已满，`flushInterval`默认值是`10 * 1000`
- 调用`logger.flush()`方法可以马上将缓冲区的日志进行输出。

## 销毁日志实例

建议在退出应用程序时调用`logger.destory()`方法用来销毁日志实例，如果退出`nodejs`程序出现不能正常退出时，可能需要调用该方法。

## Transport

`VoerkalLogger`支持使用多个`Transport`将日志输出到不同的目标。`Transport`负责将日志输出至最终的目标。

### 安装方法

`Transport`需要实例化后安装到日志实例中。

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
- `console`是内置的不需要安装。
- `@voerkalogger/file`和`@voerkalogger/http`两个`Transport`均是适用于`nodejs`。


### 构造参数

```typescript
export interface TransportBaseOptions<Output>{
    enabled?      : boolean                        // 可以单独关闭指定的日志后端
    level?        : VoerkaLoggerLevel
    format?       : VoerkaLoggerFormatter<Output> | string | null    // 格式化日志
    // 缓冲区满或达到间隔时间时进行日志输出
    // 如果bufferSize=0则禁用输出，比如ConsoleTransport就禁用输出
    bufferSize?   : number             // 输出缓冲区大小
    flushInterval?: number             // 延迟输出时间间隔，当大于间隔时间j时进行输出
}
```

### 格式化

内置支持`console`、`file`、`http`等`Transport`，一般而言:
- 输出至`控制台`会采用字符串或者经过着色后的字符串
- 输出到`文件`也会采用字符串
- 输出到`HTTP`则采用`JSON`格式。

总之，显然不同的输出目标决定了其输出格式应该不一样。

`Transport`的`format`参数用对日志输出进行格式化。`format`参数可以是一个字符串或一个函数。

```typescript
export type VoerkaLoggerFormatter<Output=VoerkaLoggerRecord> = (
    record:VoerkaLoggerRecord,
    vars:LogMethodVars 
)=>Output   

VoerkaLoggerFormatter<Output> | string | null
```

- **插值字符串格式**

当`format`参数是一个字符串时，会使用`VoerkaLoggerRecord`作为插值变量进行插值,返回插值后的字符串。可用的插值变量包括：

```typescript
{
    message,，                  // 日志信息
    level,                      // 日志级别
    timestamp,                  // 时间戳
    tags,                       // 日志标签
    module,                     // 应用模块名称或源文件，使用/分割
    version,                    // 应用版本号
    app,                        // 应用名称
    sn,                         // 设备序列号
    host,                       // 主机名称
    error,                      // 错误信息
    errorStack,                 // 错误堆栈信息
    errorLine,                  // 错误行数
    levelName,                  // 日志级别名称，如INFO,ERROR
    datetime,                   // 完整的日期时间，如"2023-03-08 10:05:07 371"
    date,                       // 日期,如2023-03-08
    time,                       // 时间 10:05:07
    // ..其他额外的信息
    // ...日志方法传入的额外信息,如logger.debug(msg,var,{a:1,...})
    // ...logger.options.context
}
```

默认的`format`参数值是:`[{levelName}] - {datetime} : {message}{<,module=>module}{<,tags=>tags}`

注意：插值字符串中的`{<,module=>module}`采用的是[flex-tools/string/params](https://zhangfisher.github.io/flex-tools/#/guide?id=params)函数来进行插值处理的，该插值算法可以正确处理当`module`参数为空时的显示问题。

```typescript

logger.debug("参数{}不正确","count")
// [DEBUG] - 2023-03-08 10:05:07 372 : 参数count不正确

logger.debug("参数{}不正确","count",{module:'file'})
// [DEBUG] - 2023-03-08 10:05:07 372 : 参数count不正确,module=file

```

- **格式化函数**

`format`参数也可以是一个函数，函数传入两个参数`record`和`插值变量`,其返回值类型由不同的`Transport`决定。

```typescript
(record: VoerkaLoggerRecord,interpVars:LogMethodVars)=>Output
```

### 开发Transport


```typescript
import { TransportBaseOptions,TransportBase, TransportOptions } from '@voerkalogger/core';

// 1. 声明配置参数
export interface MyTransportOptionss<Output> extends TransportBaseOptions<Output>{

}

// 2. 声明类
class MyTransport<Output = string> extends TransportBase<MyTransportOptions<Output>>{
    
    format(record: VoerkaLoggerRecord,interpVars:LogMethodVars)=>Output{
        // 返回格式化后的内容
    }
    async output(result:Output[]){
        // 执行输出操作
    }
}

```

开发`Transport`非常简单，只需要重载`TransportBase`的两个方法即可：

- 重载`format`方法返回格式化后的日志内容，返回类型由泛型`Output`决定，一般是`字符串`或`JSON`内容。
- 重载`async output`方法用来执行输出操作，如提交到日志服务器等。
- 需要注意的是`TransportBase`的`format`方法的默认实现是返回插值后的字符串。如果您要开发的自定义`Transport`是输出字符串，则可以不必重载`format`方法。


### Transport示例

开发`Transport`非常简单，以下是`HttpTransport`源码例子：

```typescript
import axios from 'axios';
import { TransportBase, TransportBaseOptions, TransportOptions, LogMethodVars, VoerkaLoggerRecord } from '@voerkalogger/core';
import type { AxiosInstance,AxiosRequestConfig} from 'axios';
import { assignObject } from 'flex-tools';

export type HttpTransportOptions<Output> = TransportBaseOptions<Output>  & AxiosRequestConfig & { url: string } 

export default class HttpTransport<Output=VoerkaLoggerRecord> extends TransportBase<HttpTransportOptions<Output>> {
    #http: AxiosInstance
    constructor(options?: TransportOptions<HttpTransportOptions<Output>>) {
        super(assignObject({ 
                url      : '',
                method   : 'post',                      // 访问方法
                contentType : 'application/json',
            },options)
        );
        this.#http = axios.create(this.options as AxiosRequestConfig)
    } 
    format(record: VoerkaLoggerRecord,interpVars:LogMethodVars)=>Output{
        return record
    }
    async output(results:Output[]) {
        await this.#http.request({
            ...this.options as AxiosRequestConfig,
            data: results
        })  
    } 
}
```

- 上例中，由于`TransportBase`默认的`format`方法实现是输出一个插值后的字符串。而大部份情况下，输出到日志服务器时会采用JSON格式，所以我们配置`format=null`，则默认输出的是`JSON`格式的`VoerkaLoggerRecord`。

