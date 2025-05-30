
// defaultTreeNodeActions
import { Plus, SquarePen, Trash2 } from 'lucide-react';
export const defaultTreeNodeActions = [
  {
    type: 'addChild',
    title: '添加子节点',
    icon: <Plus className="w-4 h-4 text-primary" />,
  },
  {
    type: 'edit',
    title: '编辑节点',
    icon: <SquarePen className="w-4 h-4 text-blue-500"></SquarePen>,
  },
  {
    type: 'delete',
    title: '删除节点',
    icon: <Trash2 className="w-4 h-4 text-red-500"></Trash2>,
  },
];
