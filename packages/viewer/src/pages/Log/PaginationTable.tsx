/**
 * @author
 * @file PaginationTable.tsx
 * @fileBase PaginationTable
 * @path projects\web-client\src\pages\log\PaginationTable.tsx
 * @from
 * @desc
 * @example
 */

import { useState, useEffect, memo } from 'react';
export interface PaginationTableProps {
  // value: any
}
export const PaginationTable: React.FC<PaginationTableProps> = ({
  pagination,
  onPaginationChange,
  data,
}) => {
  return <div>PaginationTable</div>;
};

// 默认导出
export default PaginationTable;
