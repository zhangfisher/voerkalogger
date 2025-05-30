/**
 * @author
 * @file spinner.tsx
 * @fileBase spinner
 * @path projects\web-client\src\components\spinner.tsx
 * @from
 * @desc
 * @example
 */

import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
export interface SpinnerProps {
  className?: ClassNameValue;
}
export const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
