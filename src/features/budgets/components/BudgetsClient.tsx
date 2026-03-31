'use client';

import { useGetBudgetsQuery } from '@/src/lib/features/budgets/budgetsApiSlice';
import { useGetTransactionsQuery } from '@/src/lib/features/transactions/transactionsApiSlice';
import BudgetsSummaryPanel from './BudgetsSummaryPanel';
import BudgetCard from './BudgetCard';
import type { Transaction } from '@/src/types';

/**
 * Returns the sum of negative transactions for a category, filtered to
 * the most recent month present in the full transactions dataset.
 */
function getSpentByCategory(transactions: Transaction[], category: string): number {
  if (transactions.length === 0) return 0;

  const latestDate = new Date(
    Math.max(...transactions.map((t) => new Date(t.date).getTime()))
  );
  const latestMonth = latestDate.getMonth();
  const latestYear = latestDate.getFullYear();

  return Math.abs(
    transactions
      .filter((t) => {
        if (t.category !== category || t.amount >= 0) return false;
        const d = new Date(t.date);
        return d.getMonth() === latestMonth && d.getFullYear() === latestYear;
      })
      .reduce((sum, t) => sum + t.amount, 0)
  );
}

function getLatestTransactions(transactions: Transaction[], category: string, count = 3): Transaction[] {
  return transactions
    .filter((t) => t.category === category && t.amount < 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export default function BudgetsClient() {
  const { data: budgets = [], isLoading: budgetsLoading, isError: budgetsError } = useGetBudgetsQuery();
  const { data: transactions = [], isLoading: txnsLoading, isError: txnsError } = useGetTransactionsQuery();

  if (budgetsLoading || txnsLoading) {
    return (
      <div className="flex flex-col gap-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-10 w-32 rounded-lg bg-grey-100 animate-pulse" />
          <div className="h-10 w-40 rounded-lg bg-grey-100 animate-pulse" />
        </div>
        {/* Content skeleton */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[428px] h-[500px] rounded-xl bg-grey-100 animate-pulse" />
          <div className="flex-1 flex flex-col gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-grey-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (budgetsError || txnsError) {
    return (
      <div className="bg-white rounded-xl p-8">
        <p className="text-preset-4 text-red">Failed to load budgets. Please refresh.</p>
      </div>
    );
  }

  const spent: Record<string, number> = {};
  for (const budget of budgets) {
    spent[budget.category] = getSpentByCategory(transactions, budget.category);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-preset-1 font-bold text-grey-900">Budgets</h1>
        <button className="bg-grey-900 text-white text-preset-4 font-bold py-4 px-5 rounded-lg hover:bg-grey-500 transition-colors whitespace-nowrap">
          + Add New Budget
        </button>
      </div>

      {/*
        Responsive two-pane layout:
        - Mobile/tablet: single column (flex-col)
        - Desktop (lg+):  two columns — summary panel left, cards right
      */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: summary panel */}
        <div className="w-full lg:w-[428px] lg:shrink-0">
          <BudgetsSummaryPanel budgets={budgets} spent={spent} />
        </div>

        {/* Right: budget cards */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.category}
              budget={budget}
              spent={spent[budget.category] ?? 0}
              remaining={Math.max(0, budget.maximum - (spent[budget.category] ?? 0))}
              latestTransactions={getLatestTransactions(transactions, budget.category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
