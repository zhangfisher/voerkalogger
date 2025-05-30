import { alovaInstance } from './alova';

export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return alovaInstance.Post(`users/avatar`, formData);
}
