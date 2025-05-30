/**
 * @author
 * @file NavigateLayout.tsx
 * @fileBase NavigateLayout
 * @path projects\web-client\src\router\NavigateLayout.tsx
 * @from
 * @desc
 * @example
 */

import { eventbus } from "@/eventbus";
import * as EVENTS from "@/eventbus/events";
import useEventbus from "@/eventbus/useEventbus";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
export interface NavigateLayoutProps {
  children: any;
}
export const NavigateLayout: React.FC<NavigateLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  function endCalling() {
    if (location.pathname === "/calling") {
      navigate("/");
    }
  }
  useEventbus(EVENTS.END_CALLING_ROUTE, endCalling);
  useEffect(() => {
    function navigateTo(options: any) {
      navigate(options.to, options.options);
    }
    eventbus.on(EVENTS.NAVIGATE, navigateTo);
    return () => {
      eventbus.off(EVENTS.NAVIGATE, navigateTo);
    };
  }, []);
  return children;
};
export default NavigateLayout;
