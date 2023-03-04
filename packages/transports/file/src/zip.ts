import { promisify } from 'node:util'
import { pipeline } from 'node:stream'
import { createReadStream,createWriteStream  } from 'node:fs'
import { createGzip } from 'node:zlib'

export async function zip(src:string,dest:string){    
    const pipe = promisify(pipeline);    
    const gzip =createGzip();
    const source = createReadStream(src);
    const destination = createWriteStream(dest);
    await pipe(source, gzip, destination);
}  