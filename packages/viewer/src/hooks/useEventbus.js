/**
 * @author
 * @file useEventbus.js
 * @fileBase useEventbus
 * @path src\hooks\useEventbus.js
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

import { eventbus } from "@/eventbus";
import { useEffect } from "react";

export default function useEventbus(event, callback) {
  useEffect(() => {
    eventbus.on(event, callback);
    return () => {
      eventbus.off(event, callback);
    };
  });
}
