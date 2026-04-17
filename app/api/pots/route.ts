import { NextResponse } from 'next/server';
import type { FinanceData, Pot } from '@/src/types';
import data from '@/src/lib/data/data.json';

export async function GET() {
  try {
    const typedData = data as FinanceData;
    return NextResponse.json(typedData.pots);
  } catch {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const pot: Pot = await request.json();
    return NextResponse.json(pot, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body: Partial<Pot> & { name: string } = await request.json();
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { name }: { name: string } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
