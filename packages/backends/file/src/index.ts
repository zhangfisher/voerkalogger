/**
 * 
 *  将日志打印到本地文件 
 *   
 */
import { BackendBase, BackendBaseOptions } from "@voerkalogger/core"
import { RotatingFileStream,createStream, Options  as RotatingFileOptions } from "rotating-file-stream"
import { assignObject } from "flex-tools/object"

// compress: <boolean> | <string> | <Function> Specifies compression method of rotated files. Default: null.
// encoding: <string> Specifies the default encoding. Default: 'utf8'.
// history: <string> Specifies the history filename. Default: null.
// immutable: <boolean> Never mutate file names. Default: null.
// initialRotation: <boolean> Initial rotation based on not-rotated file timestamp. Default: null.
// interval: <string> Specifies the time interval to rotate the file. Default: null.
// intervalBoundary: <boolean> Makes rotated file name with lower boundary of rotation period. Default: null.
// maxFiles: <number> Specifies the maximum number of rotated files to keep. Default: null.
// maxSize: <string> Specifies the maximum size of rotated files to keep. Default: null.
// mode: <number> Proxied to fs.createWriteStream. Default: 0o666.
// omitExtension: <boolean> Omits the .gz extension from compressed rotated files. Default: null.
// path: <string> Specifies the base path for files. Default: null.
// rotate: <number> Enables the classical UNIX logrotate behaviour. Default: null.
// size: <string> Specifies the file size to rotate the file. Default: null.
// teeToStdout: <boolean> Writes file content to stdout as well. Default: null.


export type FileBackendOptions =  BackendBaseOptions & RotatingFileOptions  & { filename: string}

export default class FileBackend extends BackendBase<FileBackendOptions,string> {
    #fileStream?:RotatingFileStream 
    constructor(options:FileBackendOptions) {
        super(
            assignObject({
                filename : 'log',
                interval:"1d",                  // 每天凌晨进行轮换文件
                maxSize: '10m',       
                maxFiles: 10                    // 保存的文件个数
            }, options )
        );         
        this.init()
    }   
    private init(){
        try{
            this.#fileStream = createStream(this.options.filename,this.options) 
        }catch(e){

        }
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
    async output(result: string[]) {
        this.#fileStream?.write(result.join("\r\n"))
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

    async destroy() {
        this.#fileStream?.end()
    }
}
 