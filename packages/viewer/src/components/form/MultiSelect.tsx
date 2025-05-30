import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/app';
import { ClassNameValue } from 'tailwind-merge';

interface MultiSelectProps {
  options: string[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  placeholder?: string;
  className?: ClassNameValue;
}

export const MultiSelect = ({
  options,
  selectedItems,
  setSelectedItems,
  placeholder = 'Select...',
  className,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 过滤选项
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 切换选择项
  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  return (
    <div className={cn('relative w-full', className)} ref={wrapperRef}>
      {/* 触发按钮 */}
      <div
        className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm border rounded-md cursor-pointer border-input bg-background ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}>
        <div className="flex flex-1 gap-1">
          {selectedItems.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {selectedItems.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded bg-accent text-accent-foreground">
              {item}
              <X
                className="w-3 h-3 cursor-pointer hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item);
                }}
              />
            </span>
          ))}
        </div>
        <ChevronDown className="w-4 h-4 opacity-50" />
      </div>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg bg-popover text-popover-foreground">
          {/* 搜索框 */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border-b bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* 选项列表 */}
          <div className="overflow-y-auto max-h-60">
            {filteredOptions.map((option) => (
              <div
                key={option}
                className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-accent"
                onClick={() => toggleItem(option)}>
                <Check
                  className={`mr-2 h-4 w-4 ${
                    selectedItems.includes(option) ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
