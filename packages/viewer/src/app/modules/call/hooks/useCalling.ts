import { useModuleStore } from "@voerka/react";

export function useCalling() {
  const callStore = useModuleStore("call");
  return callStore.state.currentCalling;
}
