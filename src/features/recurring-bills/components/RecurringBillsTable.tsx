'use client';

import Image from 'next/image';
import { Search, ChevronDown, ArrowUpDown, CircleCheck, CircleAlert } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { formatCurrency } from '@/src/lib/utils/formatCurrency';
import type { Transaction } from '@/src/types';

export type SortOption = 'latest' | 'oldest' | 'a-z' | 'z-a' | 'highest' | 'lowest';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
];

type BillStatus = 'paid' | 'upcoming' | 'due-soon';

function getAvatarSrc(avatar: string): string {
  return `/avatars/${avatar.replace('./assets/images/avatars/', '')}`;
}

function getDayOrdinal(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

interface Props {
  bills: Transaction[];
  search: string;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  getBillStatus: (bill: Transaction) => BillStatus;
}

export default function RecurringBillsTable({
  bills,
  search,
  sort,
  onSearchChange,
  onSortChange,
  getBillStatus,
}: Props) {
  return (
    <div className="bg-white rounded-xl p-5 md:p-8 flex flex-col gap-6">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 md:flex-none md:w-80">
          <input
            type="text"
            placeholder="Search bills"
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

        {/* Mobile: sort icon */}
        <div className="flex md:hidden items-center">
          <div className="relative flex items-center justify-center size-5">
            <ArrowUpDown size={20} className="text-grey-900 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="Sort by"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop: sort dropdown */}
        <div className="hidden md:flex items-center gap-2">
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
      </div>

      {/* Table header — desktop only */}
      <div className="hidden md:flex items-center gap-8 px-4 py-3 border-b border-grey-100 text-preset-5 text-grey-500">
        <span className="flex-1">Bill Title</span>
        <span className="w-[120px]">Due Date</span>
        <span className="w-[100px] text-right">Amount</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-5">
        {bills.length === 0 ? (
          <p className="text-preset-4 text-grey-500 py-8 text-center">No bills found.</p>
        ) : (
          bills.map((bill, index) => {
            const status = getBillStatus(bill);
            const day = new Date(bill.date).getDate();
            const dueLabel = `Monthly - ${getDayOrdinal(day)}`;
            const avatarSrc = getAvatarSrc(bill.avatar);

            return (
              <div key={`${bill.name}-${bill.date}`}>
                {index > 0 && <div className="h-px bg-grey-100 mb-5" />}

                {/* Mobile row */}
                <div className="flex md:hidden items-center justify-between">
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <Image
                      src={avatarSrc}
                      alt={bill.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover shrink-0"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-preset-4 font-bold text-grey-900 truncate">
                        {bill.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            'text-preset-5',
                            status === 'paid' ? 'text-green' : 'text-grey-500'
                          )}
                        >
                          {dueLabel}
                        </p>
                        {status === 'paid' && (
                          <CircleCheck size={16} className="text-green shrink-0" />
                        )}
                        {status === 'due-soon' && (
                          <CircleAlert size={16} className="text-red shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                  <p
                    className={cn(
                      'text-preset-4 font-bold shrink-0 ml-3',
                      status === 'due-soon' ? 'text-red' : 'text-grey-900'
                    )}
                  >
                    {formatCurrency(Math.abs(bill.amount))}
                  </p>
                </div>

                {/* Desktop row */}
                <div className="hidden md:flex items-center gap-8 px-4 rounded-lg">
                  <div className="flex flex-1 items-center gap-4">
                    <Image
                      src={avatarSrc}
                      alt={bill.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover shrink-0"
                    />
                    <p className="text-preset-4 font-bold text-grey-900">{bill.name}</p>
                  </div>
                  <div className="flex items-center gap-2 w-[120px]">
                    <p
                      className={cn(
                        'text-preset-5',
                        status === 'paid' ? 'text-green' : 'text-grey-500'
                      )}
                    >
                      {dueLabel}
                    </p>
                    {status === 'paid' && (
                      <CircleCheck size={16} className="text-green shrink-0" />
                    )}
                    {status === 'due-soon' && (
                      <CircleAlert size={16} className="text-red shrink-0" />
                    )}
                  </div>
                  <p
                    className={cn(
                      'w-[100px] text-right text-preset-4 font-bold',
                      status === 'due-soon' ? 'text-red' : 'text-grey-900'
                    )}
                  >
                    {formatCurrency(Math.abs(bill.amount))}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
