/**
 * @author
 * @file CallInView.tsx
 * @fileBase CallInView
 * @path projects\web-client\src\services\callingManager\CallInView.tsx
 * @from
 * @desc
 * @example
 */

import { Button } from "@/components/ui/button";
import { Phone, PhoneOff } from "lucide-react";
import { Calling } from "./Calling";
export interface CallInViewProps {
  calling: Calling;
}
export const CallInView: React.FC<CallInViewProps> = ({ calling }) => {
  return (
    <div>
      <h1 className="font-bold truncate">
        {calling.config.peerUser?.name} 呼入...
      </h1>
      <Button
        variant={"ghost"}
        className="text-green-500"
        onClick={calling.answer}
      >
        <Phone />
        接听
      </Button>
      <Button className="text-red-500" onClick={calling.hangup}>
        <PhoneOff />
        结束通话
      </Button>
    </div>
  );
};
