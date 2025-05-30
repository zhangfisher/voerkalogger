import mitt from "mitt";
export const eventbus = mitt();
export * as EVENTS from "./events";
if (import.meta.env.DEV) globalThis.$eventbus = eventbus;
