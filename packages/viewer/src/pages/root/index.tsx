/**
 * @author
 * @file index.tsx
 * @fileBase Root
 * @path packages\calling-client-sdk\lib\pages\Root\index.tsx
 * @from
 * @desc
 * @example
 */
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { Outlet } from "react-router";

export interface RootProps {
  // value: any
}

const Root: React.FC<RootProps> = () => {
  return (
    <div className="flex h-full">
      {/* <SidebarProvider> */}
      <AppSidebar></AppSidebar>
      <main className="w-full h-full overflow-auto">
        {/* <SidebarTrigger /> */}
        <Outlet></Outlet>
      </main>
      {/* </SidebarProvider> */}
    </div>
  );
};

export default Root;
