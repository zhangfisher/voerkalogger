import { alovaInstance } from "./alova";

export function findManyOrg() {
  return alovaInstance.Get(`orgs`).send(true);
}
export function findChildren(name: string) {
  return alovaInstance.Get(`orgs/${name}`);
}
export interface OrgCreateArgs {
  name: string;
  title: string;
  parentNodeName: string;
}
export interface OrgUpdateArgs {
  name: string;
  title: string;
  newName: string;
}
export function createChildren(data: OrgCreateArgs) {
  return alovaInstance.Post(`orgs`, data);
}
export function updateOrg(name:string, data: OrgUpdateArgs) {
  return alovaInstance.Patch(`orgs/${name}`, data);
}

export function deleteOrg(name:string) {
  return alovaInstance.Delete(`orgs/${name}`);
}

export function fuzzyFindByName(title: string) {
  return alovaInstance.Get(`orgs//${title}`);
}
