import { alovaInstance } from './alova';
import { DeptTreeView } from './dept.types';
export function findManyDepts() {
    return alovaInstance.Get<DeptTreeView>(`depts`);
}
export function findChildren(id: number) {
    return alovaInstance.Get(`depts/${id}`);
}
export interface DeptCreateArgs {
    name: string;
    title: string;
    parentNodeId: number;
}
export interface DeptUpdateArgs {
    name: string;
    title: string;
}
export function createDept(data: DeptCreateArgs) {
    return alovaInstance.Post(`depts`, data);
}

export function updateDept(id: number, data: DeptUpdateArgs) {
    return alovaInstance.Patch(`depts/${id}`, data);
}

export function deleteDept(id: number) {
    return alovaInstance.Delete(`depts/${id}`);
}

export function fuzzyFindByTitle(title: string) {
    return alovaInstance.Get(`depts/fuzzy/${title}`);
}

//部门数据同步
export function sync() {
    return alovaInstance.Get(`depts/sync`).send(true);
}
