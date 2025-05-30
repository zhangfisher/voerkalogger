import { Button } from '@/components/ui/button';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronRight, Circle, Plus, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;
export { Collapsible, CollapsibleTrigger, CollapsibleContent };
export type TreeItem = {
  id: string;
  name: string;
  title?: string;
  lv?: number; //树级别
  level?: number; //部门级别
  parentNodeId?: number;
  children?: TreeItem[];
};

export interface TreeNodeGroupProps {
  item: TreeItem;
  level?: number;
  editable?: boolean;
  selectedIds?: string[];
  selectedNodeId?: number | string;
  expanded?: boolean;
  onValueChange: (value: any) => void;
  handleAddClick?: (item: any) => void;
  handleEditClick?: (item: any) => void;
  handleDeleteClick?: (item: any) => void;
  onCheckboxChange?: (id: string, checked: boolean) => void;
}
export const TreeNode: React.FC<TreeNodeGroupProps> = ({
  item,
  level = 0,
  editable = false,
  selectedIds,
  selectedNodeId,
  expanded: defaultExpanded = false,
  onValueChange,
  handleAddClick,
  handleEditClick,
  handleDeleteClick,
  onCheckboxChange,
}: TreeNodeGroupProps) => {
  const [dialogMode, setDialogMode] = useState<string | 'create' | 'edit' | 'delete'>('create');
  const [newNodeValue, setNewNodeValue] = useState('');
  const [open, setOpen] = useState(false);
  // 控制节点展开/收起状态
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  // 判断是否有子节点
  const hasChildren = item.children && item.children.length > 0;
  // 是否被选中
  const isSelected = selectedNodeId === item.id;
  // 创建一个函数，返回一个新的函数，新函数带有正确的 parentNodeId
  const createAddItemHandler = (onAdd: any, item: any) => (event: any) => {
    if (newNodeValue === '' && dialogMode != 'delete') {
      toast.error('分组名称不能为空');
      return;
    }
    item.parentNodeId = item.id;
    item.newChildren = newNodeValue;
    onAdd(item);
    setOpen(false);
    setNewNodeValue('');
  };
  // 处理点击事件
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange(item);
  };

  // 处理展开/收起
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  //多选
  const handleCheckboxChange = (id: string, checked: boolean) => {
    onCheckboxChange && onCheckboxChange(id, checked);
  };
  return (
    <div className="w-full">
      <div
        className={cn(
          'flex items-center w-full py-2 px-2 text-sm transition-colors',
          isSelected && 'bg-primary text-primary-foreground',
          !editable && 'py-4',
        )}
        onClick={handleClick}
        role="button"
        tabIndex={0}>
        {/* 选择框 */}
        {selectedIds && (
          <input
            onClick={(e) => e.stopPropagation()}
            type="checkbox"
            checked={selectedIds?.includes(item.id)}
            onChange={(e) => {
              e.stopPropagation();
              handleCheckboxChange(item.id, e.target.checked);
            }}
            className="mr-2"
          />
        )}
        {/* 展开/收起图标 */}
        {hasChildren && (
          <div className="w-4 h-4 mr-1 cursor-pointer shrink-0" onClick={handleToggle}>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        )}
        {/* 节点名称 */}
        <span className="truncate" title={item.title || item.name}>
          {item.title || item.name}
        </span>
        {/* 新增按钮 */}
        {editable && (
          <div className="flex flex-nowrap">
            <Button
              variant="ghost"
              className="p-0 ml-2"
              onClick={(event) => {
                event.stopPropagation();
                setOpen(true);
                setDialogMode('create');
              }}>
              <Plus className="w-4 h-4 " />
            </Button>
            {/* 编辑按钮 */}
            <Button
              variant="ghost"
              className="p-0 ml-2"
              onClick={(event) => {
                event.stopPropagation();
                setOpen(true);
                setDialogMode('edit');
              }}>
              <SquarePen className="w-4 h-4 " />
            </Button>
            {/* 删除按钮 */}
            <Button
              variant="ghost"
              className="p-0 ml-2"
              onClick={(event) => {
                event.stopPropagation();
                setOpen(true);
                setDialogMode('delete');
              }}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen} modal={false}>
              <DialogContent className="h-80" onClick={(event) => event.stopPropagation()}>
                <DialogHeader onClick={(event) => event.stopPropagation()}>
                  <DialogTitle>
                    {dialogMode == 'create'
                      ? '新增分组'
                      : dialogMode == 'edit'
                        ? '编辑分组'
                        : '删除分组'}
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 w-96">
                  {(dialogMode == 'create' || dialogMode == 'edit') && (
                    <div className="grid items-center grid-cols-4">
                      <Label htmlFor="name" className="text-right">
                        分组名称：
                      </Label>
                      <Input
                        id="name"
                        value={newNodeValue}
                        onChange={(e) => setNewNodeValue(e.target.value)}
                        placeholder="请输入分组名称"
                        className="col-span-2"
                      />
                    </div>
                  )}
                  {dialogMode == 'delete' && (
                    <h1 className="w-full text-center">确定删除该分组吗？</h1>
                  )}
                </div>
                <DialogFooter>
                  <div className="flex justify-center w-full space-x-4">
                    <Button
                      type="submit"
                      onClick={createAddItemHandler(
                        dialogMode == 'create'
                          ? handleAddClick
                          : dialogMode == 'edit'
                            ? handleEditClick
                            : handleDeleteClick,
                        item,
                      )}>
                      确定
                    </Button>
                    <Button
                      onClick={(event) => {
                        setOpen(false);
                        setNewNodeValue('');
                      }}>
                      取消
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      {/* 子节点递归渲染 */}
      {hasChildren && isExpanded && (
        <div className="transition-all ml-[20px]">
          {item.children?.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              editable={editable}
              selectedNodeId={selectedNodeId}
              selectedIds={selectedIds}
              onValueChange={onValueChange}
              handleAddClick={handleAddClick}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              onCheckboxChange={onCheckboxChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
