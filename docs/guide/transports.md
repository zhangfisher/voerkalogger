# Transport

## 彩色控制台输出

支持在控制台彩色输出，适用于`nodejs`。
### 安装

```shell
npm install @voerkalogger/console
yarn add @voerkalogger/console
pnpm add @voerkalogger/console

```
### 基本用法

```typescript

import ColorizedConsoleTransport from "@voerkalogger/console"

logger.use("console",new ColorizedConsoleTransport() as unknown as TransportBase )

```
## 文件输出

将日志输出为文件中，适用于`nodejs`

### 安装

```shell
npm install @voerkalogger/file
yarn add @voerkalogger/file
pnpm add @voerkalogger/file

```

### 基本用法

```typescript

import FileTransport from "@voerkalogger/file"

// 安装FileTransport
logger.use("file",new FileTransport({
    location:"日志输出文件夹位置",
    compress: false,
    maxSize: "10k",
    maxFileCount: 5
}) as unknown as TransportBase )

```

### 配置参数

- `location`: 日志文件保存位置，可以是相对路径或绝对路径。
- `maxSize`: 日志文件会按`maxSize`指定的尺寸进行分割。`maxSize`使用`flex-tools/misc/parseFileSize`函数进行解析，可以使用如`8113`,`5M`,`1.2GB`,`1024K`之类的语法。
- `maxFileCount`: 指定保存日志文件的个数，超出日志会被移除。
- `compress`: 是否对日志文件进行压缩,启用后会将日志文件压缩为`zip`文件以节省空间。
- `encoding`: 文件编码，默认是`utf8`

### 自定义输出

默认情况下，`FileTransport`会按照`format="[{levelName}] - {datetime} : {message}{<,module=>module}{<,tags=>tags}"`模板进行插值后进行输出，如果不能满足要求，则可以自行进行扩展。方法如下：

- 直接修改`format`参数，`format`参数是一个模板字符串，支持的插值变量可参照`console`。
- 传入`format`函数：

    ```typescript
    // 安装FileTransport
    logger.use("file",new FileTransport({
        format:(record:VoerkaLoggerRecord,vars: LogMethodVars)=>{
            return " [{datetime}] {levelName} - : {message}"
        }
    }) as unknown as TransportBase )
    ```

### 文件分割

`FileTransport`将日志按`maxSize`指定的大小进行自动分割成`maxFileSize`个日志文件，形成如下：

- `1.log`       **最新**
- `2.log`
- `3.log`
- `4.log`
- `5.log`       **最旧**    

如果`compress=true`启用了压缩功能，则：

- `1.log`       **最新**
- `2.log.zip`
- `3.log.zip`
- `4.log.zip`
- `5.log.zip`   **最旧**    

**说明:**

- 能自定义日志文件名称吗？`不能`
- 目前只支持按文件大小进行分割的策略，不支持按日期进行分割。


## HTTP输出

将日志提交到远程HTTP日志服务器,适用于`nodejs`和`browser`。

### 安装

```shell
npm install @voerkalogger/http
yarn add @voerkalogger/http
pnpm add @voerkalogger/http

```

### 基本用法

```typescript

import HttpTransport from "@voerkalogger/http"

// 安装FileTransport
logger.use("http",new HttpTransport({
    url:"/log",          // 提供地址
    method   : 'post',                      // 访问方法
    contentType : 'application/json',
    //....所有axios.create配置参数
}) as unknown as TransportBase )

```

### 自定义格式

`HttpTransport`默认是提交`JSON`格式的`VoerkaLoggerRecord`数据，也可以自定义。

```typescript

import HttpTransport from "@voerkalogger/http"

interface  CustomLoggerRecord extends VoerkaLoggerRecord{
    a?:string
    b?:number
}

// 安装FileTransport
logger.use("http",new HttpTransport<CustomLoggerRecord>({
    url:"/log",          // 提供地址
    method   : 'post',                      // 访问方法
    contentType : 'application/json',
    //....所有axios.create配置参数
    format:(record:CustomLoggerRecord,vars: LogMethodVars)=>{
        return {
            ...record,
            a:"hello",
            b:1
        }
    }
}) as unknown as TransportBase )

```
