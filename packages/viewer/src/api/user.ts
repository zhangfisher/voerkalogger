import { alovaInstance } from './alova';
import { UserEntity } from './user.types';
export function createUser(data: any) {
  return alovaInstance.Post(`users`, data);
}
export function updateUser(id: any, data: any) {
  return alovaInstance.Patch(`users/${id}`, data);
}
export function findMyself() {
  return alovaInstance.Get<UserEntity>(`users/__me__?date=${Date.now()}`); // 使用date临时解决一下cache问题
}
export function findUser(id?: any) {
  return alovaInstance.Get<UserEntity>(`users/${id}`);
}
export function findManyUser(options: any = {}) {
  return alovaInstance.Get(`users`, {
    params: options,
  });
}

export function deleteUser(id: any) {
  return alovaInstance.Delete(`users/${id}`);
}

export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return alovaInstance.Post(`users/avatar`, formData);
}
