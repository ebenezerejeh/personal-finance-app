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
    const transactions = [...data.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
