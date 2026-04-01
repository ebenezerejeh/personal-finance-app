'use client';

import { useMemo, useState, useCallback } from 'react';
import { useGetRecurringBillsQuery } from '@/src/lib/features/recurring-bills/recurringBillsApiSlice';
import type { Transaction } from '@/src/types';
import TotalBillsCard from './TotalBillsCard';
import SummaryCard from './SummaryCard';
import RecurringBillsTable, { type SortOption } from './RecurringBillsTable';

type BillStatus = 'paid' | 'upcoming' | 'due-soon';

export default function RecurringBillsClient() {
  const { data: bills = [], isLoading, isError } = useGetRecurringBillsQuery();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('latest');

  const now = useMemo(() => new Date(), []);
  const today = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const getBillStatus = useCallback(
    (bill: Transaction): BillStatus => {
      const d = new Date(bill.date);
      const billDay = d.getDate();
      const billMonth = d.getMonth();
      const billYear = d.getFullYear();

      if (billMonth === currentMonth && billYear === currentYear && billDay <= today) {
        return 'paid';
      }
      if (billDay - today > 0 && billDay - today <= 5) {
        return 'due-soon';
      }
      return 'upcoming';
    },
    [today, currentMonth, currentYear]
  );

  const dedupedBills = useMemo(() => {
    const seen = new Set<string>();
    return bills.filter((bill) => {
      if (seen.has(bill.name)) return false;
      seen.add(bill.name);
      return true;
    });
  }, [bills]);

  const { totalAmount, paidBills, upcomingBills, dueSoonBills } = useMemo(() => {
    const paid: Transaction[] = [];
    const upcoming: Transaction[] = [];
    const dueSoon: Transaction[] = [];

    for (const bill of dedupedBills) {
      const status = getBillStatus(bill);
      if (status === 'paid') paid.push(bill);
      else if (status === 'due-soon') {
        dueSoon.push(bill);
        upcoming.push(bill);
      } else {
        upcoming.push(bill);
      }
    }

    const total = dedupedBills.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      totalAmount: total,
      paidBills: paid,
      upcomingBills: upcoming,
      dueSoonBills: dueSoon,
    };
  }, [dedupedBills, getBillStatus]);

  const summaryRows = useMemo(
    () => [
      {
        label: 'Paid Bills',
        count: paidBills.length,
        total: Math.abs(paidBills.reduce((s, t) => s + t.amount, 0)),
      },
      {
        label: 'Total Upcoming',
        count: upcomingBills.length,
        total: Math.abs(upcomingBills.reduce((s, t) => s + t.amount, 0)),
      },
      {
        label: 'Due Soon',
        count: dueSoonBills.length,
        total: Math.abs(dueSoonBills.reduce((s, t) => s + t.amount, 0)),
        isDueSoon: true,
      },
    ],
    [paidBills, upcomingBills, dueSoonBills]
  );

  const filteredAndSortedBills = useMemo(() => {
    let result = dedupedBills;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter((bill) => bill.name.toLowerCase().includes(lower));
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'latest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'a-z':
          return a.name.localeCompare(b.name);
        case 'z-a':
          return b.name.localeCompare(a.name);
        case 'highest':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'lowest':
          return Math.abs(a.amount) - Math.abs(b.amount);
      }
    });

    return result;
  }, [dedupedBills, search, sort]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-preset-1 font-bold text-grey-900 leading-preset-1">
          Recurring Bills
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 animate-pulse">
          <div className="flex flex-col gap-6 w-full lg:max-w-[337px]">
            <div className="h-[190px] rounded-xl bg-grey-100" />
            <div className="h-[200px] rounded-xl bg-grey-100" />
          </div>
          <div className="flex-1 h-[600px] rounded-xl bg-grey-100" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-preset-1 font-bold text-grey-900 leading-preset-1">
          Recurring Bills
        </h1>
        <div className="bg-white rounded-xl p-5 md:p-8">
          <p className="text-preset-4 text-red">
            Failed to load recurring bills. Please refresh.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-preset-1 font-bold text-grey-900 leading-preset-1">
        Recurring Bills
      </h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-6 w-full lg:max-w-[337px]">
          <TotalBillsCard total={totalAmount} />
          <SummaryCard rows={summaryRows} />
        </div>

        {/* Right side — bills table */}
        <div className="flex-1 min-w-0">
          <RecurringBillsTable
            bills={filteredAndSortedBills}
            search={search}
            sort={sort}
            onSearchChange={setSearch}
            onSortChange={setSort}
            getBillStatus={getBillStatus}
          />
        </div>
      </div>
    </div>
  );
}
