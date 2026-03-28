import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/src/lib/utils/formatCurrency';
import { cn } from '@/src/lib/utils';
import type { Transaction } from '@/src/types';

interface Props {
  transactions: Transaction[];
}

export default function TransactionsCard({ transactions }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-preset-2 font-bold text-grey-900">Transactions</h2>
        <Link
          href="/transactions"
          className="flex items-center gap-3 text-preset-4 text-grey-500 hover:text-grey-900 transition-colors"
        >
          View All
          <Image src="/icon-caret-right.svg" alt="" width={6} height={11} className="filter-[brightness(0)_opacity(0.4)]" />
        </Link>
      </div>

      {/* Transaction list */}
      <ul className="flex flex-col divide-y divide-grey-100">
        {transactions.map((t, i) => {
          const avatarSrc = `/avatars/${t.avatar.replace('./assets/images/avatars/', '')}`;
          const isPositive = t.amount > 0;

          return (
            <li key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <Image
                  src={avatarSrc}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover shrink-0"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-preset-4 font-bold text-grey-900 leading-preset-4">
                    {t.name}
                  </p>
                  <p className="text-preset-5 text-grey-500 leading-preset-5">{t.category}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p
                  className={cn(
                    'text-preset-4 font-bold leading-preset-4',
                    isPositive ? 'text-green' : 'text-grey-900'
                  )}
                >
                  {isPositive ? '+' : ''}
                  {formatCurrency(t.amount)}
                </p>
                <p className="text-preset-5 text-grey-500 leading-preset-5">
                  {formatDate(t.date)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
