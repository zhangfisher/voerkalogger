import React, {
  useState,
  useRef,
  useEffect,
  ReactElement,
  ReactNode,
} from "react";

interface Position {
  x: number;
  y: number;
}

interface DragStartEvent {
  x: number;
  y: number;
  e: React.MouseEvent;
}

type Bounds = "parent" | "window" | "none";

interface DraggableProps {
  children: ReactNode;
  initialPosition?: Position;
  bounds?: Bounds;
  onDragStart?: (event: DragStartEvent) => void;
  onDrag?: (position: Position) => void;
  onDragEnd?: (position: Position) => void;
  disabled?: boolean;
}

export const Draggable: React.FC<DraggableProps> = ({
  children,
  initialPosition = { x: 20, y: 20 },
  bounds = "parent",
  onDragStart,
  onDrag,
  onDragEnd,
  disabled = false,
}) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const elementRef = useRef<HTMLElement | null>(null);
  const parentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      parentRef.current = elementRef.current.parentElement;
    }
  }, []);

  const getBoundedPosition = (x: number, y: number): Position => {
    if (bounds === "none") return { x, y };

    const element = elementRef.current;
    if (!element) return { x, y };

    const elementRect = element.getBoundingClientRect();
    let boundingRect:
      | DOMRect
      | {
          left: number;
          top: number;
          right: number;
          bottom: number;
        };

    if (bounds === "parent" && parentRef.current) {
      boundingRect = parentRef.current.getBoundingClientRect();
    } else {
      boundingRect = {
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
      };
    }

    const minX = boundingRect.left;
    const minY = boundingRect.top;
    const maxX = boundingRect.right - elementRect.width;
    const maxY = boundingRect.bottom - elementRect.height;

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;

    e.preventDefault();
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
    onDragStart?.({ x: rect.left, y: rect.top, e });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return;

    const newPosition = getBoundedPosition(
      e.clientX - dragOffset.x,
      e.clientY - dragOffset.y
    );

    setPosition(newPosition);
    onDrag?.(newPosition);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.(position);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // 使用类型断言确保正确处理样式合并
  const childStyle: React.CSSProperties = {
    ...children.props.style,
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    cursor: disabled ? "default" : isDragging ? "grabbing" : "grab",
    userSelect: "none",
    touchAction: "none",
  };

  return React.cloneElement(children, {
    ref: elementRef,
    style: childStyle,
    onMouseDown: disabled ? children.props.onMouseDown : handleMouseDown,
    "data-dragging": isDragging,
  });
};

// 示例使用组件
interface DemoCardProps {
  title: string;
  color?: string;
}

const DemoCard: React.FC<DemoCardProps> = ({ title, color = "blue" }) => (
  <div className={`bg-${color}-500 text-white p-4 rounded-lg shadow-lg`}>
    {title}
  </div>
);

const DraggableDemo: React.FC = () => {
  const handleDragStart = (event: DragStartEvent) => {
    console.log("开始拖拽:", event);
  };

  const handleDrag = (position: Position) => {
    console.log("拖拽中:", position);
  };

  const handleDragEnd = (position: Position) => {
    console.log("拖拽结束:", position);
  };

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* 基础示例 */}
      <Draggable>
        <DemoCard title="基础拖拽" />
      </Draggable>

      {/* 带回调的示例 */}
      <Draggable
        bounds="parent"
        initialPosition={{ x: 100, y: 100 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <DemoCard title="带回调的拖拽" color="green" />
      </Draggable>

      {/* 禁用状态 */}
      <Draggable disabled>
        <DemoCard title="禁用拖拽" color="gray" />
      </Draggable>
    </div>
  );
};

export default DraggableDemo;
