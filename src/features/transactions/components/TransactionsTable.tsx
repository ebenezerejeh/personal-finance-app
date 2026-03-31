'use client';

import Image from 'next/image';
import { type Table } from '@tanstack/react-table';
import { formatCurrency, formatDate } from '@/src/lib/utils/formatCurrency';
import { cn } from '@/src/lib/utils';
import type { Transaction } from '@/src/types';

interface Props {
  table: Table<Transaction>;
}

function getAvatarSrc(avatar: string): string {
  return `/avatars/${avatar.replace('./assets/images/avatars/', '')}`;
}

export default function TransactionsTable({ table }: Props) {
  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col w-full">
      {/* Column headers — desktop only */}
      <div className="hidden md:flex items-center gap-8 px-4 py-3 border-b border-grey-100 text-preset-5 text-grey-500">
        <span className="flex-1">Recipient / Sender</span>
        <span className="w-[120px]">Category</span>
        <span className="w-[120px]">Transaction Date</span>
        <span className="w-[200px] text-right">Amount</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-4">
        {rows.length === 0 ? (
          <p className="text-preset-4 text-grey-500 py-8 text-center">No transactions found.</p>
        ) : (
          rows.map((row, index) => {
            const t = row.original;
            const isPositive = t.amount > 0;
            const avatarSrc = getAvatarSrc(t.avatar);

            return (
              <div key={row.id}>
                {index > 0 && <div className="h-px bg-grey-100 mb-4" />}

                {/* Mobile: card-style row */}
                <div className="flex md:hidden items-center justify-between">
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <Image
                      src={avatarSrc}
                      alt={t.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover shrink-0"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-preset-4 font-bold text-grey-900 truncate">{t.name}</p>
                      <p className="text-preset-5 text-grey-500">{t.category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                    <p className={cn('text-preset-4 font-bold', isPositive ? 'text-green' : 'text-grey-900')}>
                      {isPositive ? '+' : ''}{formatCurrency(t.amount)}
                    </p>
                    <p className="text-preset-5 text-grey-500">{formatDate(t.date)}</p>
                  </div>
                </div>

                {/* Desktop: table-style row */}
                <div className="hidden md:flex items-center gap-8 px-4 rounded-lg">
                  <div className="flex flex-1 items-center gap-4">
                    <Image
                      src={avatarSrc}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover shrink-0"
                    />
                    <p className="text-preset-4 font-bold text-grey-900">{t.name}</p>
                  </div>
                  <p className="w-[120px] text-preset-5 text-grey-500">{t.category}</p>
                  <p className="w-[120px] text-preset-5 text-grey-500">{formatDate(t.date)}</p>
                  <p className={cn('w-[200px] text-right text-preset-4 font-bold', isPositive ? 'text-green' : 'text-grey-900')}>
                    {isPositive ? '+' : ''}{formatCurrency(t.amount)}
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
