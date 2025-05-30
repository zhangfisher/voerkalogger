/**
 * @function fun
 * @description 函数用于
 * @param
 * @returns
 * @example
 * fun() // ->
 */
import { routes } from "@/router/routes";
import { createHashRouter, createMemoryRouter } from "react-router";
export enum RouterType {
  Browser = "browser",
  Memory = "memory",
}
export function generateRouter(
  type: RouterType = RouterType.Browser,
  options?: any
) {
  return type === RouterType.Browser
    ? createHashRouter(routes, { basename: '/', ...options })
    : createMemoryRouter(routes, { basename: '/', ...options });
}
