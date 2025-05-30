import { LoadingSpinner } from "@/components/ui/spinner";
import { Suspense } from "react";

/**
 * @author
 * @file SuspenseLayout.tsx
 * @fileBase SuspenseLayout
 * @path packages\calling-client-sdk\lib\router\SuspenseLayout.tsx
 * @from
 * @desc
 * @example
 */

export interface SuspenseLayoutProps {
  children: any;
}
export const SuspenseLayout: React.FC<SuspenseLayoutProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner></LoadingSpinner>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default SuspenseLayout;
