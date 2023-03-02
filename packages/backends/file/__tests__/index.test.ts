import { test, expect } from "vitest"
import { getLogFilename } from "../src/utils"
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import type { LogRotatePeriod } from "../src";
import path from "path";

dayjs.extend(isoWeek)
dayjs.extend(dayOfYear) 


test("获取输出日志文件",async ()=>{
    const templ = "{rotateDate}_{order}.log"
    const now = dayjs("2022/8/9")
    // 天 20220809_1
    await expect(getLogFilename(templ,"DAY",__dirname,now)).resolves.toEqual(path.join(__dirname,`${now.format("YYYYMMDD")}_1.log`))    
    // 周 202215_1
    await expect(getLogFilename(templ,"WEEK",__dirname,now)).resolves.toEqual(path.join(__dirname,`${now.format("YYYY")}${now.isoWeek()}_1.log`))
    // 月 202208_1
    await expect(getLogFilename(templ,"MONTH",__dirname,now)).resolves.toEqual(path.join(__dirname,`${now.format("YYYYMM")}_1.log`))
    // 年 2022_1
    await expect(getLogFilename(templ,"YEAR",__dirname,now)).resolves.toEqual(path.join(__dirname,`${now.format("YYYY")}_1.log`))


})


