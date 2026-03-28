'use client';

import { useGetOverviewQuery } from '@/src/lib/features/overview/overviewApiSlice';
import BalanceCards from './BalanceCards';
import PotsCard from './PotsCard';
import TransactionsCard from './TransactionsCard';
import BudgetsCard from './BudgetsCard';
import RecurringBillsCard from './RecurringBillsCard';

export default function OverviewClient() {
  const { data, isLoading, isError } = useGetOverviewQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-grey-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-grey-100" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-preset-4 text-red">
        Failed to load overview data. Please refresh the page.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <BalanceCards balance={data.balance} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <PotsCard pots={data.pots} />
          <TransactionsCard transactions={data.recentTransactions} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <BudgetsCard budgets={data.budgets} transactions={data.allTransactions} />
          <RecurringBillsCard recurringBills={data.recurringBills} />
        </div>
      </div>
    </div>
  );
}
