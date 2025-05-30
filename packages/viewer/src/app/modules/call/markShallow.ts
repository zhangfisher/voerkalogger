import { markRaw } from '@autostorejs/react';

export function markShallow(root: any) {
  Object.keys(root).forEach(([key]) => {
    console.log(`root, key`, root, key);
    markRaw(root[key]);
  });
  return root;
}
