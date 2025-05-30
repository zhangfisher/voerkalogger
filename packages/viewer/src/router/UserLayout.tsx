/**
 * @author
 * @file UserLayout.tsx
 * @fileBase UserLayout
 * @path projects\web-client\src\router\UserLayout.tsx
 * @from
 * @desc
 * @example
 */

import { useModuleStore } from "@voerka/react";
import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router";
export interface UserLayoutProps {
  children: React.ReactNode;
}
export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const userStore = useModuleStore("user");
  // @ts-ignore
  const [user] = userStore.useReactive("user");
  const navigate = useNavigate();
  if (!user) {
    navigate("/login");
  }
  return children;
};

// 默认导出
export default UserLayout;
