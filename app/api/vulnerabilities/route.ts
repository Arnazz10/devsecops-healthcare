import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET() {
  const store = getStore();
  // Aggregate findings from all runs for the vulnerabilities page
  const findings = store.runs.flatMap(r => 
    r.stages.flatMap(s => 
      s.findings.map(f => ({ ...f, buildId: r.id, timestamp: r.timestamp }))
    )
  );
  return NextResponse.json(findings);
}
