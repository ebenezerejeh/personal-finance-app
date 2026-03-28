import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { FinanceData } from '@/src/types';

async function getData(): Promise<FinanceData> {
  const filePath = path.join(process.cwd(), 'app_assets', 'data.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as FinanceData;
}

export async function GET() {
  try {
    const data = await getData();

    // Latest 5 transactions
    const recentTransactions = [...data.transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // Recurring bills due this month (recurring transactions)
    const recurringBills = data.transactions.filter((t) => t.recurring);

    return NextResponse.json({
      balance: data.balance,
      pots: data.pots,
      budgets: data.budgets,
      recentTransactions,
      allTransactions: data.transactions,
      recurringBills,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
