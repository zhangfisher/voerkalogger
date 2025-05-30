/**
 * @author
 * @file FloatIconButton.tsx
 * @fileBase FloatIconButton
 * @path packages\calling-client-sdk\src\app\FloatIconButton.tsx
 * @from
 * @desc
 * @example
 */

export interface FloatIconButtonProps {
  // value: propTypes.any
}
import { Button } from '@/components/ui/button';
import { PhoneCallIcon } from 'lucide-react';
import { useModuleStore } from '@voerka/react';
import usePanelPosition from '@/hooks/usePanelPosition';
import { cn } from '@/lib/utils';
export const FloatAppEntry: React.FC<FloatIconButtonProps> = () => {
  const appStore = useModuleStore('app');
  const [entryPosition] = appStore.useReactive('entryButtonPosition');
  const positionClassName = usePanelPosition(entryPosition);
  return (
    <div className={cn('fixed z-50 p-2', positionClassName)}>
      <Button variant="outline" size="icon">
        <PhoneCallIcon></PhoneCallIcon>
      </Button>
    </div>
  );
};
