'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
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

// Chevron matching the Figma caret icon
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="6"
      viewBox="0 0 11 6"
      fill="none"
      aria-hidden="true"
      className={cn('transition-transform duration-200 shrink-0 text-grey-900', open && 'rotate-180')}
    >
      <path
        d="M1 1L5.5 5L10 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface DropdownItem {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  /** Desktop: shown as a labelled trigger button */
  trigger: React.ReactNode;
  /** Mobile: shown as an icon button */
  mobileIcon: React.ReactNode;
  /** Label shown at the top of the mobile panel */
  mobileLabel: string;
  items: DropdownItem[];
  selected: string;
  onSelect: (value: string) => void;
  panelWidth?: string;
}

function FilterDropdown({
  trigger,
  mobileIcon,
  mobileLabel,
  items,
  selected,
  onSelect,
  panelWidth = 'w-28',
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const panel = (
    <ul
      role="listbox"
      className={cn(
        'absolute right-0 top-full mt-1 z-50',
        'bg-white rounded-lg shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)]',
        'py-3 px-5 max-h-[300px] overflow-y-auto',
        panelWidth
      )}
    >
      {items.map((item, idx) => (
        <li key={item.value}>
          <button
            type="button"
            role="option"
            aria-selected={item.value === selected}
            onClick={() => {
              onSelect(item.value);
              setOpen(false);
            }}
            className={cn(
              'w-full text-left text-preset-4 text-grey-900 py-0 cursor-pointer',
              'hover:font-bold transition-all',
              item.value === selected ? 'font-bold' : 'font-normal'
            )}
          >
            {item.label}
          </button>
          {idx < items.length - 1 && <div className="h-px bg-grey-100 my-3" />}
        </li>
      ))}
    </ul>
  );

  const mobilePanelWithLabel = (
    <ul
      role="listbox"
      className={cn(
        'absolute right-0 top-full mt-1 z-50',
        'bg-white rounded-lg shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)]',
        'py-3 px-5 max-h-[300px] overflow-y-auto',
        panelWidth
      )}
    >
      {/* Label header (mobile only) */}
      <li>
        <p className="text-preset-4 text-grey-500 whitespace-nowrap">{mobileLabel}</p>
        <div className="h-px bg-grey-100 my-3" />
      </li>
      {items.map((item, idx) => (
        <li key={item.value}>
          <button
            type="button"
            role="option"
            aria-selected={item.value === selected}
            onClick={() => {
              onSelect(item.value);
              setOpen(false);
            }}
            className={cn(
              'w-full text-left text-preset-4 text-grey-900 py-0 cursor-pointer',
              'hover:font-bold transition-all',
              item.value === selected ? 'font-bold' : 'font-normal'
            )}
          >
            {item.label}
          </button>
          {idx < items.length - 1 && <div className="h-px bg-grey-100 my-3" />}
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={ref} className="relative">
      {/* Desktop trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'hidden md:flex items-center gap-4',
          'bg-white border border-grey-900 rounded-lg px-5 py-3 cursor-pointer',
          'text-preset-4 text-grey-900 whitespace-nowrap',
          'hover:bg-beige-100 transition-colors'
        )}
      >
        {trigger}
        <ChevronIcon open={open} />
      </button>

      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex md:hidden items-center justify-center size-5 cursor-pointer"
      >
        {mobileIcon}
      </button>

      {/* Panel */}
      {open && (
        <>
          {/* Desktop panel (no label) */}
          <div className="hidden md:block">{panel}</div>
          {/* Mobile panel (with label) */}
          <div className="block md:hidden">{mobilePanelWithLabel}</div>
        </>
      )}
    </div>
  );
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
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Latest';
  const categoryLabel = category || 'All Transactions';

  const categoryItems: DropdownItem[] = [
    { value: '', label: 'All Transactions' },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Search */}
      <div className="relative flex-1 md:flex-none md:w-80">
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

      {/* Right controls */}
      <div className="flex items-center gap-6">
        {/* Sort by */}
        <div className="flex items-center gap-2">
          <span className="hidden md:block text-preset-4 text-grey-500 whitespace-nowrap">Sort by</span>
          <FilterDropdown
            trigger={<span>{sortLabel}</span>}
            mobileIcon={<ArrowUpDown size={20} className="text-grey-900" />}
            mobileLabel="Sort by"
            items={SORT_OPTIONS}
            selected={sort}
            onSelect={(v) => onSortChange(v as SortOption)}
            panelWidth="w-[114px]"
          />
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <span className="hidden md:block text-preset-4 text-grey-500 whitespace-nowrap">Category</span>
          <FilterDropdown
            trigger={<span>{categoryLabel}</span>}
            mobileIcon={<SlidersHorizontal size={20} className="text-grey-900" />}
            mobileLabel="Category"
            items={categoryItems}
            selected={category}
            onSelect={onCategoryChange}
            panelWidth="w-[177px]"
          />
        </div>
      </div>
    </div>
  );
}
