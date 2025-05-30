import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function mergeClassName(...inputs) {
  return twMerge(clsx(inputs));
}
// shadcn ~
export const cn = mergeClassName;
