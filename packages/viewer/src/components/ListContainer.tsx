/**
 * @author
 * @file ListContainer.tsx
 * @fileBase ListContainer
 * @path projects\web-client\src\components\ListContainer.tsx
 * @from
 * @desc
 * @example
 */

export interface ListContainerProps {
  children: React.ReactNode;
}
export const ListContainer: React.FC<ListContainerProps> = ({ children }) => {
  return (
    <div className="w-full h-full bg-primary-foreground">
      <main className="flex flex-col w-full max-w-screen-lg max-h-full gap-2 overflow-auto">
        {children}
      </main>
    </div>
  );
};

// 默认导出
export default ListContainer;
