import { alovaInstance } from "./alova";
import {
  CallCreateOptions,
  CallFindManyOptions,
  CallFindManyResponse,
} from "./call.types";

// 创建通话记录
export function createCall(data: CallCreateOptions) {
  return alovaInstance.Post("/calls", data);
}
// 获取通话记录的API
export const findManyCall = (callFindManyOptions: CallFindManyOptions) =>
  alovaInstance.Get<CallFindManyResponse>("/calls", {
    params: callFindManyOptions,
  });
export function updateCall(id: number, data: CallCreateOptions) {
  return alovaInstance.Patch(`/calls/${id}`, data);
}

// TODO 设置通讯录删除策略
export function setCallDeleteStrategy() {}
