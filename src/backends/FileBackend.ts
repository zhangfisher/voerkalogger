/**
 * 
 *  将日志打印到本地文件
 *   
 *  fs实例是从VoerkaApp.platform.fs中获取
 *   
 */
import path from "path-browserify"
import { BatchBackendBaseOptions } from "../types";
import BatchBackend from "./BatchBackend" 

export interface FileSystem{
    exists(filename: string):Promise<boolean>;
    mkdir(filename: string): Promise<void>;
    delete(filename: string): Promise<void>;
    rename(filename: string,newFilename: string): Promise<void>;
    stat(filename: string): Promise<{size:number}>;
    [key: string]: any
}

export interface FileBackendOptions extends BatchBackendBaseOptions{
    location : string               // 日志保存位置
    format:string                   // 可用插值变量: level, message, datetime
    maxFileSize: number             // 日志文件最大尺寸
    maxFiles: number                // 保存的文件个数
    fs:any                          // 文件系统对象，用来访问文件
}

export default class FileBackend extends BatchBackend<FileBackendOptions> {
    constructor(options:FileBackendOptions) {
        super(
            Object.assign({
                location : './data/logs',
                format:"[{level}] {datetime} - {message}",            // 可用插值变量: level, message, datetime
                maxFileSize: 10 * 1024 * 1024,  // 10M
                maxFiles: 5,                    // 保存的文件个数
            }, options )
        );
        this.initOutputFolder().then(()=>{}).catch((e)=>{
            console.log("初始化日志输出文件夹出错：",e.message)
        })
    }  
    get fs() {
        return this.options.fs || globalThis.fs
    }
 
    private async initOutputFolder(){
        if(!await this.fs.exists(this.options.location)){
            await this.fs.mkdir(this.options.location)
        }
    }

    /**
     *  文件名从新至旧为 1.log,2.log,...n.log，
     *  当超过备份文件数时，将删除最旧的文件，
     *  1.log总是最新日志数据
     * @returns 
     */
    async _getFilename() {
        let curFilename = path.join(this.options.location, `1.log`)
        let backupFileCount = this.options.maxFiles -1
        const logPath = path.dirname(this.options.location)
        // 判定文件是否超出大小
        if (await this.fs.exists(curFilename)) {
            let stat =await this.fs.stat(curFilename)
            if(stat.size > this.options.maxFileSize){                
                // 已经达到最大的文件数量时，需要删除最旧的文件 
                for(let i=backupFileCount;i>0;i--){
                    let logFile = path.join(logPath,`${i}.log`)
                    if(await this.fs.exists(logFile)){
                        if(i===backupFileCount){
                            await this.fs.delete(logFile)
                        }else{
                            await this.fs.rename(logFile,path.join(logPath,`${i+1}.log`))
                        }                  
                    }
                }
            }
        }
        return curFilename
    }
    async batchOutput(results:any[]) {
        const filename =await this._getFilename()
        try {
            await this.fs.appendFile(filename, results.join("\n")+"\n")
        } catch (e) {
            console.log(e);
         }
    }
    /**
     * 清空日志 
     */
    async clear(){
        const filenames =  new Array(this.options.maxFiles).map((value,index)=>path.join(this.options.location ,`${index+1}.log`))
        filenames.forEach(async filename=>{
            if(await this.fs.exists(filename)){
                try{
                    await this.fs.delete(filename)
                }catch(e){}
            }
        })             
    }
}
