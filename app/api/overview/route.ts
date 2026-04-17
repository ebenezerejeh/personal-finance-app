import { NextResponse } from 'next/server';
import type { FinanceData } from '@/src/types';
import data from '@/src/lib/data/data.json';

export async function GET() {
  try {
    const typedData = data as FinanceData;

    // Latest 5 transactions
    const recentTransactions = [...typedData.transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // Recurring bills due this month (recurring transactions)
    const recurringBills = typedData.transactions.filter((t) => t.recurring);

    return NextResponse.json({
      balance: typedData.balance,
      pots: typedData.pots,
      budgets: typedData.budgets,
      recentTransactions,
      allTransactions: typedData.transactions,
      recurringBills,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
