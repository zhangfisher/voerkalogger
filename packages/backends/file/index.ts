/**
 * 
 *  将日志打印到本地文件 
 *   
 */
import path from "path-browserify"
import { BatchBackendBase } from "@voerkalogger/core" 

 

export interface FileBackendOptions extends BatchBackendBaseOptions{
    location : string               // 日志保存位置
    format:string                   // 可用插值变量: level, message, datetime
    maxFileSize: number             // 日志文件最大尺寸
    maxFiles: number                // 保存的文件个数
    fs:any                          // 文件系统对象，用来访问文件
}

export default class FileBackend extends BatchBackendBase<FileBackendOptions> {
    constructor(options:FileBackendOptions) {
        super(
            Object.assign({
                location : './data/logs',
                format:"[{level}] {datetime} - {message}",            // 可用插值变量: level, message, datetime
                maxFileSize: 10 * 1024 * 1024,  // 10M
                maxFiles: 5,                    // 保存的文件个数
            }, options )
        );
 
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
        if (await fs.exists(curFilename)) {
            let stat =await fs.stat(curFilename)
            if(stat.size > this.options.maxFileSize){                
                // 已经达到最大的文件数量时，需要删除最旧的文件 
                for(let i=backupFileCount;i>0;i--){
                    let logFile = path.join(logPath,`${i}.log`)
                    if(await fs.exists(logFile)){
                        if(i===backupFileCount){
                            await fs.delete(logFile)
                        }else{
                            await fs.rename(logFile,path.join(logPath,`${i+1}.log`))
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
            await fs.appendFile(filename, results.join("\n")+"\n")
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
            if(await fs.exists(filename)){
                try{
                    await fs.delete(filename)
                }catch(e){}
            }
        })             
    }
}
