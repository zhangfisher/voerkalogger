import { alovaInstance } from './alova';

export function disconnectPeer(peerId: string) {
  return alovaInstance.Post(`/peer/disconnect/${peerId}`);
}
