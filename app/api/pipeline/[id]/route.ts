import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = getStore();
  const run = store.runs.find(r => r.id === id);
  
  if (!run) {
    return NextResponse.json({ error: 'Pipeline run not found' }, { status: 404 });
  }

  return NextResponse.json(run);
}
