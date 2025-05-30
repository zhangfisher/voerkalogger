export interface UserEntity {
  createdAt: string;
  updatedAt: string;
  id: any;
  name: string;
  title: string;
  titleEn: string;
  alias?: string;
  avatar?: string;
  email?: string;
  groups: string;
  deptId?: number;
  phone?: string;
  role: string;
  disabled: boolean;
  [key: string]: any;
}
