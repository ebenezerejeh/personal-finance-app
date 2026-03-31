'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | 'ellipsis';

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  // Show all pages when 5 or fewer
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: PageItem[] = [1];

  const rangeStart = Math.max(2, currentPage - 1);
  const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

  if (rangeStart > 2) items.push('ellipsis');
  for (let p = rangeStart; p <= rangeEnd; p++) items.push(p);
  if (rangeEnd < totalPages - 1) items.push('ellipsis');

  items.push(totalPages);
  return items;
}

export default function TransactionsPagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pageItems = getPageItems(currentPage, totalPages);

  const buttonBase =
    'flex items-center justify-center h-10 rounded-lg border border-beige-500 text-preset-4 text-grey-900 bg-white transition-colors hover:bg-grey-100 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="flex items-center justify-between pt-6">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(buttonBase, 'gap-4 px-4')}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
        <span className="hidden md:inline">Prev</span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-2">
        {pageItems.map((item, i) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${i}`}
              className="size-10 flex items-center justify-center text-preset-4 text-grey-500 select-none"
              aria-hidden="true"
            >
              &hellip;
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={cn(
                'size-10 flex items-center justify-center rounded-lg text-preset-4 transition-colors',
                item === currentPage
                  ? 'bg-grey-900 text-white'
                  : 'border border-beige-500 text-grey-900 bg-white hover:bg-grey-100'
              )}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(buttonBase, 'gap-4 px-4')}
        aria-label="Next page"
      >
        <span className="hidden md:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
