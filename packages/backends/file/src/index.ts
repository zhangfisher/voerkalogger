/**
 * 
 *  将日志打印到本地文件 
 *   
 */
import { BackendBase, BackendBaseOptions } from "@voerkalogger/core"
import { RotatingFileStream,createStream, Options  as RotatingFileOptions } from "rotating-file-stream"
import { assignObject,pick } from "flex-tools/object"
import type { FileSize } from "flex-tools/types"
 

const defaultRotatingFileOptions = {
    compress:false,             // <boolean> | <string> | <Function> Specifies compression method of rotated files. Default: null.
    encoding: 'utf8',           // <string> Specifies the default encoding. Default: 'utf8'.
    history:null,               // <string> Specifies the history filename. Default: null.
    immutable:null,             //  <boolean> Never mutate file names. Default: null.
    initialRotation:null,       // <boolean> Initial rotation based on not-rotated file timestamp. Default: null.
    interval: null,             // <string> Specifies the time interval to rotate the file. Default: null.
    intervalBoundary:null,      // <boolean> Makes rotated file name with lower boundary of rotation period. Default: null.
    maxFiles: null,             // <number> Specifies the maximum number of rotated files to keep. Default: null.
    maxSize: null,              // <string> Specifies the maximum size of rotated files to keep. Default: null.
    mode: 0o666,                // <number> Proxied to fs.createWriteStream. Default: 0o666.
    omitExtension: null,        // <boolean> Omits the .gz extension from compressed rotated files. Default: null.
    path: null,                 // <string> Specifies the base path for files. Default: null.
    rotate: null,               // <number> Enables the classical UNIX logrotate behaviour. Default: null.
    size: null,                 // <string> Specifies the file size to rotate the file. Default: null.
    teeToStdout: null           // <boolean> Writes file content to stdout as well. Default: null.
}
 

export type FileBackendOptions =  BackendBaseOptions & RotatingFileOptions  & { 
    // 日志文件名,默认格式是:  <轮换日期>-<文件序号>.log
    // 例： rotate='day'  每天生成日志文件，超过maxSize则拆分为1-2-3....    
    //     第1天: 20220801-1.log,20220801-2.log  
    //     第2天: 20220802-1.log,20220802-2.log,20220802-3.log
    //     第N天：......
    // 例： rotate='month'  每月生成日志文件，超过maxSize则拆分为1-2-3....    
    //     第1天: 202208-1.log,202208-2.log  
    //     第2天: 202208-1.log,202208-2.log,202208-3.log
    //     第N天：......
    filename?: string                               
    location?: string                               // 保存日志文件的位置
    compress?: boolean                              // 是否进行压缩
    encoding?: string                               // 编码，默认为utf8
    rotate?: 'day' | 'week' | 'month' | 'year'      // 按日期进行分割
    maxSize?: FileSize                              // 单个日志文件最大尺寸
    // 日志文件数量限制,采用定时审查策略，即在指定的时间进行检查
    // 如
    maxFileCount?: number                           
    // 所有日志文件的总容量大小，超过也删除旧的文件
    // 日志总容量不是实时计算的,采用定时审查策略
    // 例：auditInterval = 1h, 则每隔一小时检查一下日志总空量是否超出
    maxTotalSize?:FileSize                          
    // 定时审查策略的时间间隔,取值  
    auditInterval?:number
    access?:number                                  // 文件权限,默认是0o666
}

export default class FileBackend extends BackendBase<FileBackendOptions,string> {
    #fileStream?:RotatingFileStream 
    constructor(options:FileBackendOptions) {
        super(
            assignObject({
                filename : 'log',
                interval:'5s',                  // 每天凌晨进行轮换文件
                maxSize: '20K',       
                size:"15K",
                maxFiles: 10,                    // 保存的文件个数
                path:".",
                history: true
            }, options )
        );         
        this.init()
    }   
    private init(){
        try{
            this.#fileStream = createStream(this.options.filename,pick(this.options,Object.keys(defaultRotatingFileOptions))) 
            this.#fileStream.on("error",(err:Error)=>{
                this.outputError(err)
            })
        }catch(e:any){
            this.outputError(new Error(`Create fileBackend stream error:${e.message}`))
        }
    } 
    async output(result: string[]) {
        this.#fileStream?.write('\r\n'+result.join("\r\n"))
    }
    /**
     * 清空日志 
     */
    async clear(){
        // const filenames =  new Array(this.options.maxFiles).map((value,index)=>path.join(this.options.location ,`${index+1}.log`))
        // filenames.forEach(async filename=>{
        //     if(await fs.exists(filename)){
        //         try{
        //             await fs.delete(filename)
        //         }catch(e){}
        //     }
        // })             
    }
    /**
     *  文件名从新至旧为 1.log,2.log,...n.log，
     *  当超过备份文件数时，将删除最旧的文件，
     *  1.log总是最新日志数据
     * @returns 
     */
    // async _getFilename() {
    //     let curFilename = path.join(this.options.location, `1.log`)
    //     let backupFileCount = this.options.maxFiles -1
    //     const logPath = path.dirname(this.options.location)
    //     // 判定文件是否超出大小
    //     if (await fs.exists(curFilename)) {
    //         let stat =await fs.stat(curFilename)
    //         if(stat.size > this.options.maxFileSize){                
    //             // 已经达到最大的文件数量时，需要删除最旧的文件 
    //             for(let i=backupFileCount;i>0;i--){
    //                 let logFile = path.join(logPath,`${i}.log`)
    //                 if(await fs.exists(logFile)){
    //                     if(i===backupFileCount){
    //                         await fs.delete(logFile)
    //                     }else{
    //                         await fs.rename(logFile,path.join(logPath,`${i+1}.log`))
    //                     }                  
    //                 }
    //             }
    //         }
    //     }
    //     return curFilename
    // }
    async destroy() {
        this.#fileStream?.end()
    }
}
 