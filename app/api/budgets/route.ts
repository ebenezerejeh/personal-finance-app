import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Budget, FinanceData } from '@/src/types';

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

export async function POST(request: Request) {
  try {
    const budget: Budget = await request.json();
    return NextResponse.json(budget, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const budget: Budget = await request.json();
    return NextResponse.json(budget);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { category }: { category: string } = await request.json();
    if (!category) {
      return NextResponse.json({ error: 'category is required' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
