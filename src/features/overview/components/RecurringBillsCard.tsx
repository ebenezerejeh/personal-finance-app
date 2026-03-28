import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/src/lib/utils/formatCurrency';
import type { Transaction } from '@/src/types';

interface Props {
  recurringBills: Transaction[];
}

const BILL_RANGES = [
  { label: 'Paid Bills', color: 'bg-green' },
  { label: 'Total Upcoming', color: 'bg-yellow' },
  { label: 'Due Soon', color: 'bg-cyan' },
] as const;

export default function RecurringBillsCard({ recurringBills }: Props) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.getDate();

  const paid = recurringBills.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && d.getDate() <= today;
  });

  const upcoming = recurringBills.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && d.getDate() > today;
  });

  const dueSoon = upcoming.filter((t) => {
    const d = new Date(t.date);
    return d.getDate() - today <= 5;
  });

  const paidTotal = Math.abs(paid.reduce((s, t) => s + t.amount, 0));
  const upcomingTotal = Math.abs(upcoming.reduce((s, t) => s + t.amount, 0));
  const dueSoonTotal = Math.abs(dueSoon.reduce((s, t) => s + t.amount, 0));

  const rows = [
    { label: 'Paid Bills', color: 'text-green', amount: paidTotal, count: paid.length },
    { label: 'Total Upcoming', color: 'text-yellow', amount: upcomingTotal, count: upcoming.length },
    { label: 'Due Soon', color: 'text-cyan', amount: dueSoonTotal, count: dueSoon.length },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-preset-2 font-bold text-grey-900">Recurring Bills</h2>
        <Link
          href="/recurring-bills"
          className="flex items-center gap-3 text-preset-4 text-grey-500 hover:text-grey-900 transition-colors"
        >
          See Details
          <Image src="/icon-caret-right.svg" alt="" width={6} height={11} className="filter-[brightness(0)_opacity(0.4)]" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map(({ label, color, amount }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl border border-grey-100 px-4 py-5"
          >
            <div className="flex items-center gap-3">
              <span className={`w-1 h-5 rounded-full ${color === 'text-green' ? 'bg-green' : color === 'text-yellow' ? 'bg-yellow' : 'bg-cyan'}`} />
              <p className="text-preset-4 text-grey-500 leading-preset-4">{label}</p>
            </div>
            <p className={`text-preset-4 font-bold leading-preset-4 ${color}`}>
              {formatCurrency(amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
