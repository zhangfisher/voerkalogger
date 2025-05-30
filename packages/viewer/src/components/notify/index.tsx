import React, { createContext, useCallback, useContext, useState } from "react";
import { X } from "lucide-react";

// 类型定义
interface NotifyContextType {
  addNotification: (content: React.ReactNode) => NotifyInstance;
}

interface NotifyInstance {
  id: string;
  close: () => void;
}

interface NotificationProps {
  id: string;
  content: React.ReactNode;
  onClose: (id: string) => void;
}

// 创建Context
const NotifyContext = createContext<NotifyContextType | null>(null);

// 通知组件
const Notification: React.FC<NotificationProps> = ({
  id,
  content,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between p-4 mb-2 bg-white rounded-lg shadow-lg">
      <div className="mr-4">{content}</div>
      <button
        onClick={() => onClose(id)}
        className="text-gray-500 transition-colors hover:text-gray-700"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// 容器组件
export const NotifyContainer: React.FC<{ children: any }> = ({ children }) => {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      content: React.ReactNode;
    }>
  >([]);

  const addNotification = useCallback(
    (content: React.ReactNode): NotifyInstance => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { id, content }]);

      const close = () => {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        );
      };

      // // 自动关闭
      // setTimeout(close, 3000);

      return { id, close };
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  return (
    <NotifyContext.Provider value={{ addNotification }}>
      <div className="fixed z-50 top-4 right-4 w-72">
        {notifications.map(({ id, content }) => (
          <Notification
            key={id}
            id={id}
            content={content}
            onClose={removeNotification}
          />
        ))}
      </div>
      {children}
    </NotifyContext.Provider>
  );
};

// Hook
export const useNotify = () => {
  const context = useContext(NotifyContext);
  if (!context) {
    throw new Error("useNotify must be used within a NotifyContainer");
  }
  return context.addNotification;
};

// Helper function
export const notify = (
  content: React.ReactNode | ((n: NotifyInstance) => React.ReactNode)
) => {
  const notifyContext = useContext(NotifyContext);
  if (!notifyContext) {
    throw new Error("notify must be used within a NotifyContainer");
  }

  if (typeof content === "function") {
    const tempInstance: NotifyInstance = {
      id: "",
      close: () => {},
    };
    const renderedContent = content(tempInstance);
    const instance = notifyContext.addNotification(renderedContent);
    tempInstance.id = instance.id;
    tempInstance.close = instance.close;
    return instance;
  }

  return notifyContext.addNotification(content);
};

export default NotifyContainer;
