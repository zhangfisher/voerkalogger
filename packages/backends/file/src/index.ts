/**
 * 
 *  将日志打印到本地文件 
 *   
 */
import "flex-tools/string"
import { BackendBase, BackendBaseOptions } from "@voerkalogger/core"
import { assignObject } from "flex-tools/object"
import type { FileSize,TimeDuration } from "flex-tools/types"
import { parseFileSize,parseTimeDuration } from "flex-tools"
import path from "path"
import fs  from "fs-extra"
import dayjs from 'dayjs';

export type LogRotatePeriod= 'DAY' | 'MONTH' | 'WEEK' |'YEAR'

export type FileBackendOptions =  BackendBaseOptions & { 
    // 日志文件名,默认格式是:  <轮换日期>-<文件序号>.log
    // 例： rotate='DAY'  每天生成日志文件，超过maxSize则拆分为1-2-3....    
    //     第1天: 20220801-1.log,20220801-2.log  
    //     第2天: 20220802-1.log,20220802-2.log,20220802-3.log
    //     第N天：......
    // 例： rotate='MONTH'  每月生成日志文件，超过maxSize则拆分为1-2-3....    
    //     第1天: 202208-1.log,202208-2.log  
    //     第2天: 202208-1.log,202208-2.log,202208-3.log
    //     第N天：......
    filename?: string | (()=>string)                // 日志文件格式定义
    location?: string                               // 保存日志文件的位置
    compress?: boolean                              // 是否进行压缩
    encoding?: string                               // 编码，默认为utf8
    rotate?:  LogRotatePeriod                          
    maxSize?: FileSize                              // 单个日志文件最大尺寸,如`5MB`
    // 日志文件数量限制,采用定时审查策略，即在指定的时间进行检查
    // 注意：不是实时生效的，而是按auditInterval指定的时间进行检查，然后删除多余的文件
    maxFileCount?: number                           
    // 所有日志文件的总容量大小，超过也删除旧的文件
    // 日志总容量不是实时计算的,采用定时审查策略
    // 例：auditInterval = 1h, 则每隔一小时检查一下日志总空量是否超出
    maxTotalSize?:FileSize                          
    // 定时审查策略的时间间隔,取值  
    auditInterval?:TimeDuration
    access?:number                                  // 文件权限,默认是0o666
}

export default class FileBackend extends BackendBase<FileBackendOptions,string> {
    #filename:string = "1.log"
    #auditTimer:any = 0
    #outputPath:string = ""                     // 日志完整输出路径
    constructor(options:FileBackendOptions) {
        super(
            assignObject({
                filename: "{date}_{seq}.log",                               
                location: "logs",                               // 保存日志文件的位置
                compress: false,                                // 是否进行压缩
                encoding: "utf8",                               // 编码，默认为utf8
                maxSize:'50MB',                                 // 单个日志文件最大尺寸,如`5MB`
                maxFileCount: 10,                               // 日志文件数量限制                         
                maxTotalSize:"500M",                            // 所有日志文件的总容量大小，超过也删除旧的文件                
                auditInterval:"5m",                             // 定时审查策略的时间间隔,取值  
                access:  0o666                                  // 文件权限,默认是
            }, options ) //as FileBackendOptions
        );         
        // 输出保存路径
        this.#outputPath =path.isAbsolute(this.options.location) ? this.options.location : path.join(process.cwd(), this.options.location)
        // 启动定时审查日志文件
        this.startPollingAudit()
    }   

    /**
     * 定时审查日志总容量和大小是否超过
     */
    private startPollingAudit(){
        const auditInterval = parseTimeDuration(this.options.auditInterval)
        if(this.enabled && auditInterval>0){
            this.#auditTimer = setTimeout(async () => {
                this.#auditTimer = 0
            }, auditInterval)
        }
    } 

   

    async output(result: string[]) {
        // 1. 取得当前文件
        //const filename =  this.getFilename()         

       // await fs.writeFile(filename, result.join(this.options.))
    }

    /**
     * 清空日志 
     */
    async clear(){
       
    }

    async destroy() {
        clearTimeout(this.#auditTimer)        
    }
}
 