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
    return NextResponse.json(data.budgets);
  } catch {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
