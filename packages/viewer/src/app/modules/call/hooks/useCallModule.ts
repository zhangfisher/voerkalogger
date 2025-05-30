import { useModule } from "@voerka/react";
import { CallModule } from "..";

export const useCallModule = () => {
  const callModule = useModule("call") as CallModule;
  return callModule;
};
