import { NextResponse } from 'next/server';
import type { FinanceData } from '@/src/types';
import data from '@/src/lib/data/data.json';

export async function GET() {
  try {
    const typedData = data as FinanceData;
    const transactions = [...typedData.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
