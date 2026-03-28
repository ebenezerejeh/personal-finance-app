'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/src/lib/utils/formatCurrency';
import type { Budget, Transaction } from '@/src/types';

interface Props {
  budgets: Budget[];
  transactions: Transaction[];
}

function getSpent(transactions: Transaction[], category: string): number {
  // Use the most recent month in the dataset for spending calculation
  const categoryTxns = transactions.filter((t) => t.category === category && t.amount < 0);
  if (categoryTxns.length === 0) return 0;

  const latestDate = new Date(
    Math.max(...transactions.map((t) => new Date(t.date).getTime()))
  );
  const latestMonth = latestDate.getMonth();
  const latestYear = latestDate.getFullYear();

  return Math.abs(
    categoryTxns
      .filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === latestMonth && d.getFullYear() === latestYear;
      })
      .reduce((sum, t) => sum + t.amount, 0)
  );
}

export default function BudgetsCard({ budgets, transactions }: Props) {
  const chartData = budgets.map((b) => ({
    name: b.category,
    value: Math.min(getSpent(transactions, b.category), b.maximum),
    theme: b.theme,
  }));

  const totalBudget = budgets.reduce((sum, b) => sum + b.maximum, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + getSpent(transactions, b.category), 0);

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-preset-2 font-bold text-grey-900">Budgets</h2>
        <Link
          href="/budgets"
          className="flex items-center gap-3 text-preset-4 text-grey-500 hover:text-grey-900 transition-colors"
        >
          See Details
          <Image src="/icon-caret-right.svg" alt="" width={6} height={11} className="filter-[brightness(0)_opacity(0.4)]" />
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut chart */}
        <div className="relative w-55 h-55 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={100}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.theme} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-preset-1 font-bold text-grey-900">{formatCurrency(totalSpent)}</p>
            <p className="text-preset-5 text-grey-500">of {formatCurrency(totalBudget)} limit</p>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1">
          {budgets.map((b) => (
            <div key={b.category} className="flex items-center gap-3">
              <span
                className="w-1 h-10 rounded-full shrink-0"
                style={{ backgroundColor: b.theme }}
              />
              <div className="flex flex-col gap-1">
                <p className="text-preset-5 text-grey-500 leading-preset-5">{b.category}</p>
                <p className="text-preset-4 font-bold text-grey-900 leading-preset-4">
                  {formatCurrency(b.maximum)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
