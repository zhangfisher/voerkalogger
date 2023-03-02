import "flex-tools/string"
import path from "path"
import fs  from "fs-extra"
import dayjs,{type Dayjs} from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear'

import type { FileBackendOptions } from "."
import { DeepRequired } from 'ts-essentials';
import { parseFileSize } from 'flex-tools';
 
dayjs.extend(isoWeek)

export async function getLogFilename(options:DeepRequired<FileBackendOptions>,now?:Dayjs): Promise<string> {
    const filenameTempl = typeof(options.filename) == 'function' ? options.filename() : options.filename
    const outputPath = path.isAbsolute(options.location) ?  options.location : path.join(process.cwd(),options.location)

    if(!now) now = dayjs()

    let seq = 1

    let logFilename= path.join(outputPath, "1.log")
    let logFiles = []
    while(true){
        const filename = filenameTempl.params({
            date:now.format("YYYYMMDD"),
            week:now.isoWeek(),
            day:now.dayOfYear(),
            month:now.month(),
            seq
        })  
        logFilename = path.join(outputPath, filename)
        logFiles.push(logFilename)
        if(!(await fs.existsSync(logFilename))){
            break
        }else{
            const logFileSize = (await fs.stat(logFilename)).size
            const maxSize = parseFileSize(options.maxSize)
            if(logFileSize < maxSize){
                return logFilename
            }else{

            }
        }

        seq++;
    }  
    return logFilename    
}