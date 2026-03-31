'use client';

import { Search, ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type SortOption = 'latest' | 'oldest' | 'a-z' | 'z-a' | 'highest' | 'lowest';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
];

interface Props {
  search: string;
  sort: SortOption;
  category: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onCategoryChange: (value: string) => void;
}

export default function TransactionsFilters({
  search,
  sort,
  category,
  categories,
  onSearchChange,
  onSortChange,
  onCategoryChange,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Search */}
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Search transaction"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            'w-full border border-beige-500 rounded-lg px-5 py-3 pr-12',
            'text-preset-4 text-grey-900 placeholder:text-beige-500',
            'focus:outline-none focus:border-grey-900 transition-colors bg-white'
          )}
        />
        <Search
          className="absolute right-5 top-1/2 -translate-y-1/2 text-grey-900 pointer-events-none"
          size={16}
        />
      </div>

      {/* Sort + Category controls */}
      <div className="flex items-center gap-6">
        {/* Sort by */}
        <div className="flex items-center gap-2">
          <span className="text-preset-4 text-grey-500 whitespace-nowrap">Sort by</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className={cn(
                'appearance-none border border-beige-500 rounded-lg px-5 py-3 pr-10 w-[113px]',
                'text-preset-4 text-grey-900 bg-white',
                'focus:outline-none focus:border-grey-900 transition-colors cursor-pointer'
              )}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-900 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <span className="text-preset-4 text-grey-500 whitespace-nowrap">Category</span>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={cn(
                'appearance-none border border-beige-500 rounded-lg px-5 py-3 pr-10 w-[177px]',
                'text-preset-4 text-grey-900 bg-white',
                'focus:outline-none focus:border-grey-900 transition-colors cursor-pointer'
              )}
            >
              <option value="">All Transactions</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-900 pointer-events-none"
              size={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
