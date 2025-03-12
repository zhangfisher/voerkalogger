import { config } from "@/config";
import { compare } from "bcryptjs";

/**
 * @function checkUnLock
 * @description 函数用于 检查是否解锁
 * @param
 * @returns
 * @example
 * checkUnLock() // ->
 */
const lockConfig = config.get("lock");
export function checkValid() {
  if (lockConfig.disabled) {
    return true;
  }
  const expiredAt = getValid();
  if (!expiredAt) {
    return false;
  }
  if (Date.now() > expiredAt) {
    return false;
  }
  return true;
}
const LOCK_EXPIRED_AT = "LOCK_EXPIRED_AT";
const twentyFourHoursInMillsSeconds = 24 * 60 * 60 * 1000;
export async function setValid() {
  localStorage.setItem(
    LOCK_EXPIRED_AT,
    Date.now() + twentyFourHoursInMillsSeconds,
  );
}
export function getValid() {
  return localStorage.getItem(LOCK_EXPIRED_AT);
}
export async function checkPassword(password) {
  if (!password) {
    return false;
  }
  try {
    // console.log(`lockConfig.secret`, lockConfig.secret);
    // console.log(`import.meta.env.`, import.meta.env.VITE__VOERKA__LOCK__SECRET);
    return await compare(
      password,
      // FIXME 从.env获取出错,所以直接写了
      lockConfig.secret,
    );
  } catch {
    return false;
  }
}
