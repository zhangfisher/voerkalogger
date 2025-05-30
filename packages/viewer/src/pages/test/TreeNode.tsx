// TreeNode.tsx
import * as React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// 类型定义
interface TreeData {
  id: string;
  name: string;
  children?: TreeData[];
}

interface TreeNodeProps {
  item: TreeData;
  level?: number;
  selectedNodeId?: string;
  onValueChange: (value: string) => void;
  expanded?: boolean;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  level = 0,
  selectedNodeId,
  onValueChange,
  expanded: defaultExpanded = false,
}) => {
  // 控制节点展开/收起状态
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  // 判断是否有子节点
  const hasChildren = item.children && item.children.length > 0;

  // 是否被选中
  const isSelected = selectedNodeId === item.id;

  // 处理点击事件
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange(item.id);
  };

  // 处理展开/收起
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex items-center w-full py-1.5 px-2 text-sm transition-colors",
          "hover:bg-accent/50 cursor-pointer",
          isSelected && "bg-accent text-accent-foreground",
          level > 0 && "ml-[20px]"
        )}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        {/* 展开/收起图标 */}
        {hasChildren && (
          <div
            className="w-4 h-4 mr-1 cursor-pointer shrink-0"
            onClick={handleToggle}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        )}

        {/* 没有子节点时的占位 */}
        {!hasChildren && <div className="w-4 h-4 mr-1" />}

        {/* 节点名称 */}
        <span className="truncate">{item.name}</span>
      </div>

      {/* 子节点递归渲染 */}
      {hasChildren && isExpanded && (
        <div className="transition-all">
          {item.children?.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              selectedNodeId={selectedNodeId}
              onValueChange={onValueChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
