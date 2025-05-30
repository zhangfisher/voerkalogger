// import Cookies from "js-cookie";
import { config } from "@/config";
// const TOKEN = "token";
// 一个用于检查 token 的函数
export const checkToken = () => {
  // 这里实现你的 token 检查逻辑
  // 例如，从 localStorage 或 cookie 中获取 token
  // const token = Cookies.get(TOKEN);
  const token = getToken();
  // console.log(`checkToken`, token);
  return !isTokenExpired(token); // 假设 token 存在即为有效
};

export function setToken(token) {
  // return Cookies.set(TOKEN, token);
  return config.set("token", token);
}

export function getToken() {
  // return Cookies.get(TOKEN);
  return (config.get("token") || "").trim();
}

export function isTokenExpired(token) {
  try {
    if (!token) {
      return true;
    }
    const basePayload = token.split(".")[1];
    if (!basePayload) {
      return true;
    }
    const payload = JSON.parse(
      decodeURIComponent(encodeURIComponent(atob(basePayload))),
    );
    const exp = payload.exp;
    // 对没有exp进行容忍
    if (!exp) {
      return false;
    }
    const currentTime = Math.floor(Date.now() / 1000); // 当前时间的秒数
    return exp < currentTime;
  } catch (err) {
    return false;
  }
}
