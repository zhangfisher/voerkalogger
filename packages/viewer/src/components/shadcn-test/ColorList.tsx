import React from 'react';

export const ColorList: React.FC = () => {
  // 定义颜色变量名称
  const colorVariables = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'muted',
    'border',
    'background',
    'foreground',
    'card',
    'popover',
    'modal',
  ];

  return (
    <div className="p-4 space-y-4 bg-green-500">
      <h1 className="text-2xl font-bold">Shadcn/ui 主题颜色列表</h1>
      <ul className="pl-6 list-disc">
        {colorVariables.map((color, index) => (
          <li key={index} className={`text-${color}`}>
            {color}
          </li>
        ))}
        {colorVariables.map((color, index) => (
          <li key={index} className={`text-${color}-foreground`}>
            {`text-${color}-foreground`}
          </li>
        ))}
        {colorVariables.map((color, index) => (
          <li key={index} className={`bg-${color}`}>
            {`bg-${color}`}
          </li>
        ))}
        {colorVariables.map((color, index) => (
          <li key={index} className={`bg-${color}-foreground`}>
            {`bg-${color}-foreground`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColorList;
