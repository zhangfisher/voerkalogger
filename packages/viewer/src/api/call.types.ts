export interface CallCreateOptions {
  from: string;
  to: string;
  status: string;
  connected?: boolean;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
}
export interface CallEntity {
  createdAt: Date;
  updatedAt: Date;
  from: string;
  fromName: string;
  fromTitle: string;
  fromTitleEn: string | null;
  fromAvatar: string | null;
  to: string;
  toName: string;
  toTitle: string;
  toTitleEn: string | null;
  toAvatar: string | null;
  status: string;
  connected: boolean;
  startedAt: Date;
  endedAt: Date | null;
  duration: number | null;
  id?: number;
  readStatus?: boolean;
}
export interface CallFindManyOptions {
  ownerId?: string; // TODO 其实这个不需要搞
  filterText?: string;
  orderByTime?: boolean;
  statusId?: number;
  page: number;
  pageSize: number;
}
export interface CallFindManyResponse {
  data: CallEntity[];
  total: number;
  page: number;
  pageSize: number;
}
