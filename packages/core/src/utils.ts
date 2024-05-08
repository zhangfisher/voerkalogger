
import {
	VoerkaLoggerLevelNames,
	VoerkaLoggerLevel,
	VoerkaLoggerLevelName,
} from "./consts";
import { formatDateTime } from "flex-tools/misc/formatDateTime";


export function isFunction(fn: any) {
	return typeof fn === "function";
}
export function isError(err: any) {
	return err instanceof Error;
}

export function safeCall(fn: Function) {
	try {
		return fn();
	} catch {}
}

/**
 * 输出默认的错误，用在当logger自身出错时在控制台输出错误信息
 * @param e
 */
export function outputError(e: Error, now?: number) {
	const datetime = formatDateTime(now || new Date(),"YYYY-MM-DD HH:mm:ss SSS");
	console.error(`[ERROR] - ${datetime} : ${e.stack}`);
}

/**
 * 用来将日志级别转换为数字
 *
 * 内部使用数字来标识日志级别，但是在配置时允许使用字符串来标识日志级别，
 * 比如：'NOSET','debug','info','warn','error','fatal'
 * 比如：'NOSET','DEBUG','INFO','WARN','ERROR','FATAL'
 * 也可以是数字：0,1,2,3,4,5
 *
 *
 * @param level
 */
export function normalizeLevel(
	level: string | number | VoerkaLoggerLevel | VoerkaLoggerLevelName
): VoerkaLoggerLevel {
	let result: VoerkaLoggerLevel;
	if (level === undefined || level === null || Number.isNaN(level)) {
		result = VoerkaLoggerLevel.WARN;
	} else if (typeof level == "string") {
		const levelValue = VoerkaLoggerLevelNames.indexOf(level.toUpperCase());
		result = levelValue <= 0 ? VoerkaLoggerLevel.WARN : levelValue;
	} else if (typeof level == "number") {
		result = level < 0 || level > 5 ? VoerkaLoggerLevel.WARN : level;
	} else {
		result = VoerkaLoggerLevel.WARN;
	}
	return result;
}

// const presetColors: any = {
// 	white: 37,
// 	black: 30,
// 	blue: 34,
// 	cyan: 36,
// 	green: 32,
// 	magenta: 35,
// 	red: 31,
// 	yellow: 33,
// 	brightBlack: 90,
// 	brightRed: 91,
// 	brightGreen: 92,
// 	brightYellow: 93,
// 	brightBlue: 94,
// 	brightMagenta: 95,
// 	brightCyan: 96,
// 	brightWhite: 97,
// };

// export function colorize(message: string, color: keyof typeof presetColors) {
// 	return "\x1b["+presetColors[color]+"m"+message+"\x1b[0m";
// }
// import dayjs from "dayjs";
// import type {
// 	LogMethodOptions,
// 	LogMethodVars,
// 	VoerkaLoggerRecord,
// } from "./types";
// import { isPlainObject } from "flex-tools/typecheck/isPlainObject";
// import { mapObject } from "flex-tools/object/mapObject";
// import type { VoerkaLogger } from "./Logger";
// /**
//  * 执行一个函数，如果出错则返回错误信息
//  * @param {*} fn
//  */
// export function callWithError(fn: Function): any {
// 	try {
// 		return fn();
// 	} catch (e: any) {
// 		return e.stack;
// 	}
// }

// function getLevelName(level: number): string {
// 	return VoerkaLoggerLevelNames[level < 1 || level > 5 ? 3 : level];
// }
// /**
//  * 处理日志参数
//  *
//  * 将日志参数转换为日志对象，info = {message,timestamp,tags,module,.....}
//  *
//  * @param {*} message  输出日志内容
//  * @param {*} vars    插值变量数组或{}
//  * @param {*} options
//  * @returns  {Object}  info =  {message,timestamp,tags,module,.....}
//  */
// export function handleLogArgs(
// 	message: string | Function,
// 	vars: LogMethodVars,
// 	options: LogMethodOptions = {}
// ): VoerkaLoggerRecord {
// 	try {
// 		let opts = Object.assign(
// 			{
// 				tags: [], //
// 				module: undefined, // 日志来源模块名称
// 				level: VoerkaLoggerLevel.WARN, // 默认级别WARN
// 			},
// 			options
// 		);

// 		let now = dayjs();
// 		let { tags, module, ...extras } = opts;

// 		// 处理插值变量

// 		let interpVars = isFunction(vars) 	? callWithError(vars)
// 			: isError(vars) ? vars.stack
// 			: vars;

// 		// 执行变量中的函数，如果执行出错则会显示错误信息
// 		if (Array.isArray(interpVars)) {
// 			interpVars = interpVars.map((v) =>
// 				isFunction(v) ? callWithError(v)
// 					: isError(v) ? { error: v.message, errorStack: v.stack }
// 					: v
// 			);
// 		} else if (isPlainObject(interpVars)) {
// 			interpVars = mapObject(interpVars, (v: any) =>
// 				isFunction(v) ? callWithError(v) : isError(v) ? v.stack : v
// 			);
// 			interpVars["levelName"] = getLevelName(interpVars.level);
// 			interpVars["datetime"] = now
// 				.format("YYYY-MM-DD HH:mm:ss SSS")
// 				.padEnd(23);
// 			interpVars["date"] = now.format("YYYY-MM-DD");
// 			interpVars["time"] = now.format("HH:mm:ss");
// 		} else {
// 			interpVars = [String(interpVars)];
// 		}
 
// 		const msg = isError(message) ? (message as any).stack
// 			: isFunction(message) ? callWithError(message as any)
// 			: String(message);

// 		return {
// 			...extras,
// 			message: Array.isArray(interpVars) ? msg.params(...interpVars)
// 				: msg.params(interpVars),
// 			tags,
// 			scope: module,
// 			timestamp: Date.now(),
// 		};
// 	} catch {
// 		return {
// 			level: VoerkaLoggerLevel.WARN,
// 			message: String(message),
// 			timestamp: Date.now(),
// 			...options,
// 		};
// 	}
// }

// /**
//  * 返回插值变量字典，用来对message进行插值替换
//  */
// export function getInterpolatedVars(
// 	this: VoerkaLogger,
// 	record: VoerkaLoggerRecord
// ): Record<string, any> {
// 	const logger = this;
// 	const {
// 		message,
// 		level,
// 		timestamp,
// 		error,
// 		tags,
// 		scope: module,
// 		...extras
// 	} = record;
// 	let now = dayjs(record.timestamp);
// 	let levelName = VoerkaLoggerLevelNames[level];
// 	return {
// 		level: levelName.padEnd(5).toUpperCase(),
// 		datetime: now.format("YYYY-MM-DD HH:mm:ss SSS").padEnd(23),
// 		message,
// 		timestamp,
// 		date: now.format("YYYY-MM-DD"),
// 		time: now.format("HH:mm:ss"),
// 		tags: tags ? (Array.isArray(tags) ? tags.join(",") : String(tags)) : "",
// 		module: module || "",
// 		...extras,
// 		...(logger.options.context || {}),
// 	};
// }