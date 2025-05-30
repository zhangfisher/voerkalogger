import mitt from "mitt";
export const eventbus = mitt();
if (import.meta.env.DEV) {
  (globalThis as any).$eventbus = eventbus;
}
