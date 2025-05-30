/**
 * @author
 * @file LoadingButton.tsx
 * @fileBase LoadingButton
 * @path projects\web-client\src\components\form\LoadingButton.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
export interface LoadingButtonProps {
  loading: boolean;
}
export const LoadingButton: React.FC<LoadingButtonProps> = ({ loading, ...props }) => {
  return (
    <Button>
      <motion.div
        className="icon-container"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
        {/* 替换为你的图标 */}
        <i className="fa fa-spinner fa-spin"></i>
      </motion.div>
    </Button>
  );
};

// 默认导出
export default LoadingButton;
