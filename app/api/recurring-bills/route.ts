import { NextResponse } from 'next/server';
import type { FinanceData } from '@/src/types';
import data from '@/src/lib/data/data.json';

export async function GET() {
  try {
    const typedData = data as FinanceData;
    const recurringBills = typedData.transactions
      .filter((t) => t.recurring)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return NextResponse.json(recurringBills);
  } catch {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
