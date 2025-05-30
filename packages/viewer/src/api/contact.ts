/*
 * @FilePath: \voerka-phone\projects\web-client\src\api\contact.ts
 * @Author: zk.su
 * @Date: 2025-01-17 11:34:47
 * @LastEditTime: 2025-03-24 11:29:16
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
import { alovaInstance } from './alova';

/**
 * @function findManyContact
 * @description 函数用于
 * @param
 * @returns
 * @example
 * findManyContact() // ->
 */
interface ContactFindManyOptions {
    ownerId?: string;
    filterText?: string;
    filterByHasStar?: boolean;
    orderByTitle?: boolean;
    orgId?: number;
    deptId?: number;
    page?: number;
    pageSize?: number;
}
interface ContactUpdateOptions {
    tags: string[];
    remark?: string;
}
export function findManyContact(contactFindManyOptions: ContactFindManyOptions) {
    return alovaInstance.Get('contacts', {
        params: contactFindManyOptions,
    });
}
export function createContact(data: any) {
    return alovaInstance.Post('contacts', data);
}

export function updateContact(targetId: string, data: ContactUpdateOptions) {
    return alovaInstance.Patch(`contacts/${targetId}`, data);
}

export function deleteContact(id: string) {
    return alovaInstance.Delete(`contacts/${id}`);
}
