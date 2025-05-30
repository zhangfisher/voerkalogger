/**
 * @author
 * @file StarToggler.tsx
 * @fileBase StarToggler
 * @path projects\web-client\src\components\form\StarToggler.tsx
 * @from
 * @desc
 * @example
 */

import { StarFilled, StarOutlined } from '@ant-design/icons';
import { Button } from '../ui/button';
export interface StarTogglerProps {
  value: boolean;
  onChange: (value: boolean) => void;
  [key: string]: any;
}
export const StarToggler: React.FC<StarTogglerProps> = ({ value = false, onChange, ...props }) => {
  return (
    <Button {...props} variant={'ghost'} onClick={() => onChange(!value)}>
      {value ? <StarFilled className="text-yellow-500" /> : <StarOutlined />}
    </Button>
  );
};

// 默认导出
export default StarToggler;
