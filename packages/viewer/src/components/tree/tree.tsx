// components/ui/tree/tree.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export type TreeNodeType = {
  id: string | number;
  label: string;
  children?: TreeNodeType[];
};

interface TreeProps {
  data: TreeNodeType[];
  onSelect?: (node: TreeNodeType) => void;
  className?: string;
}

interface TreeNodeProps extends TreeNodeType {
  onSelect?: (node: TreeNodeType) => void;
  level?: number;
}

const TreeNode = ({
  id,
  label,
  children,
  onSelect,
  level = 0,
}: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasChildren = children && children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center py-1 px-2 rounded-sm hover:bg-accent",
          "cursor-pointer text-sm"
        )}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          onSelect?.({ id, label, children });
        }}
      >
        {hasChildren && (
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              isExpanded ? "transform rotate-90" : ""
            )}
          />
        )}
        {!hasChildren && <span className="w-4" />}
        <span className="ml-1">{label}</span>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {children.map((node) => (
            <TreeNode
              key={node.id}
              {...node}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function Tree({ data, onSelect, className }: TreeProps) {
  return (
    <div className={cn("w-full", className)}>
      {data.map((node) => (
        <TreeNode key={node.id} {...node} onSelect={onSelect} />
      ))}
    </div>
  );
}
