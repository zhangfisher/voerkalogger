/**
 * @author
 * @file PermissionLayout.tsx
 * @fileBase PermissionLayout
 * @path projects\web-client\src\router\PermissionLayout.tsx
 * @from
 * @desc
 * @example
 */

import { UserModule } from "@/app";
import { useModuleStore } from "@voerka/react";
import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router";
export interface PermissionLayoutProps {
  permissions: any[];
  children: any;
}
export const PermissionLayout: React.FC<PermissionLayoutProps> = ({
  children,
  permissions,
}) => {
  const userStore = useModuleStore<UserModule>("user");
  // @ts-ignore
  const isAdmin = userStore.useReactive("user.isAdmin");
  const navigate = useNavigate();
  useEffect(() => {
    if (!permissions.length) {
      return;
    }
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate, permissions]);

  return children;
};

// 默认导出
export default PermissionLayout;
