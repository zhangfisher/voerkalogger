// TreeSelect.tsx
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { X } from "lucide-react"; // 确保已安装 lucide-react
import { TreeNode } from "@/components/tree/treeNode";

interface TreeData {
  id: string;
  name: string;
  children?: TreeData[];
}

interface TreeSelectProps {
  data: TreeData;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowClear?: boolean; // 是否允许清空
}

export const TreeSelect: React.FC<TreeSelectProps> = ({
  data,
  value,
  onChange,
  placeholder = "请选择",
  allowClear = true,
}) => {
  const [selectedLabel, setSelectedLabel] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  const findNodeName = (node: TreeData, targetId: string): string => {
    if (node.id === targetId) {
      return node.name;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeName(child, targetId);
        if (found) return found;
      }
    }
    return "";
  };

  React.useEffect(() => {
    if (value) {
      const name = findNodeName(data, value);
      setSelectedLabel(name);
    } else {
      setSelectedLabel("");
    }
  }, [value, data]);

  const handleValueChange = (newValue: any) => {
    console.log(newValue)
    onChange(newValue.name);
    const name = findNodeName(data, newValue.name);
    setSelectedLabel(name);
    setOpen(false);
  };

  // 清空选择
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSelectedLabel("");
  };

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="relative h-auto">
        {allowClear && value && (
          <div className="absolute top-0 bottom-0 flex flex-col justify-center rounded-full cursor-pointer right-8 ">
            <div
              className="hover:bg-accent hover:text-accent-foreground"
              onClick={handleClear}
            >
              <X className="w-3 h-3" />
            </div>
          </div>
        )}

        <SelectTrigger>
          <SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
        </SelectTrigger>
      </div>
      <SelectContent>
        <div className="max-h-[300px] overflow-auto">
          {/* 添加一个"清空"选项 */}
          {allowClear && (
            <div
              className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
              onClick={() => handleValueChange("")}
            >
              <span className="ml-1">清空选择</span>
            </div>
          )}
          <TreeNode
            item={data}
            selectedNodeId={value}
            onValueChange={handleValueChange}
          />
        </div>
      </SelectContent>
    </Select>
  );
};
