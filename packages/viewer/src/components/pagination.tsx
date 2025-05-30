/**
 * @author
 * @file PaginationBar.tsx
 * @fileBase PaginationBar
 * @path projects\web-client\src\components\PaginationBar.tsx
 * @from
 * @desc
 * @example
 */

import { cn } from '@/lib/utils';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
    PaginationLink,
} from '@/components/ui/pagination';
export interface PaginationBarProps {
    pagination: {
        currentPage: number;
        pageSize: number;
        total: number;
    };
    onPageChange: (page: number) => void;
    [key: string]: any; // 允许其他属性
    // value: any
}
export const PaginationBar: React.FC<PaginationBarProps> = ({
    pagination,
    onPageChange,
    ...props
}) => {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const { numbers, showStartEllipsis, showEndEllipsis } = findPaginationShowArray(
        pagination.currentPage,
        pagination.total,
        pagination.pageSize,
    );

    return (
        <Pagination {...props}>
            <PaginationContent>
                <PaginationItem className="cursor-pointer">
                    <PaginationPrevious
                        onClick={() => onPageChange(1)}
                        aria-disabled={pagination.currentPage <= 1}
                    />
                </PaginationItem>

                {showStartEllipsis && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {numbers.map((page) => (
                    <PaginationItem key={page} className="cursor-pointer">
                        <PaginationLink
                            className={cn({
                                'bg-accent text-accent-foreground': pagination.currentPage === page,
                            })}
                            onClick={() => onPageChange(page)}
                            aria-current={pagination.currentPage === page}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {showEndEllipsis && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                <PaginationItem className="cursor-pointer">
                    <PaginationNext
                        onClick={() => onPageChange(totalPages)}
                        aria-disabled={pagination.currentPage >= totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

// 默认导出
export default PaginationBar;
export function findPaginationShowArray(currentPage: number, total: number, pageSize: number) {
    if (!total) return { numbers: [], showStartEllipsis: false, showEndEllipsis: false };

    const totalPages = Math.ceil(total / pageSize);
    const showPages = 5;
    let numbers: number[] = [];
    let showStartEllipsis = false;
    let showEndEllipsis = false;

    // 如果总页数小于等于5，显示所有页码
    if (totalPages <= showPages) {
        numbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    // 如果当前页靠近开始
    else if (currentPage <= 3) {
        numbers = [1, 2, 3, 4, 5];
        showEndEllipsis = true;
    }
    // 如果当前页靠近结束
    else if (currentPage >= totalPages - 2) {
        numbers = Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
        showStartEllipsis = true;
    }
    // 在中间的情况
    else {
        numbers = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
        showStartEllipsis = true;
        showEndEllipsis = true;
    }

    return {
        numbers,
        showStartEllipsis,
        showEndEllipsis,
    };
}
