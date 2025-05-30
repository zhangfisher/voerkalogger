/**
 * @author
 * @file CallOutView.tsx
 * @fileBase CallOutView
 * @path projects\web-client\src\services\callingManager\CallOutView.tsx
 * @from
 * @desc
 * @example
 */

import { Button } from "@/components/ui/button";
import { PhoneOff } from "lucide-react";
export interface CallOutViewProps {
  id: string;
  onHangup: any;
}
export const CallOutView: React.FC<CallOutViewProps> = ({ id, onHangup }) => {
  return (
    <div>
      <h1 className="font-bold truncate" title={id}>
        呼叫 {id}
      </h1>
      <Button variant="ghost" onClick={onHangup} className="text-red-500">
        <PhoneOff></PhoneOff>
      </Button>
    </div>
  );
};
