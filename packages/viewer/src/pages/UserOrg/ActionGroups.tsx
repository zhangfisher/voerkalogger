/**
 * @author
 * @file ActionGroups.tsx
 * @fileBase ActionGroups
 * @path projects\web-client\src\pages\UserOrg\ActionGroups.tsx
 * @from
 * @desc
 * @example
 */
import { ClassNameValue } from 'tailwind-merge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
export interface Action {
  type: string;
  title: string;
  icon: React.ReactNode;
}
export interface ActionGroupsProps {
  className?: ClassNameValue;
  actions: Action[];
  onAction: (type: string) => void;
}
export const ActionGroups: React.FC<ActionGroupsProps> = ({ actions, onAction, className }) => {
  return (
    <div className={cn('flex flex-row space-x-2', className)}>
      {actions.map((action: Action) => (
        <Button
          key={action.type}
          variant="ghost"
          className="size-6"
          title={action.title}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAction(action.type);
          }}>
          {action.icon}
        </Button>
      ))}
    </div>
  );
};

// 默认导出
export default ActionGroups;
