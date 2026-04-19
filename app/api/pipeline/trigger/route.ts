import { NextResponse } from 'next/server';
import { generatePipeline, simulateStage } from '@/lib/mockSecurityEngine';
import { addRun, updateRun } from '@/lib/store';

export async function POST() {
  const newRun = generatePipeline();
  addRun(newRun);

  // Background simulation starts
  // Note: In production, this would be a background job / worker
  (async () => {
    let currentRun = newRun;
    let totalFindings = 0;
    let isBlocked = false;

    for (let i = 0; i < currentRun.stages.length; i++) {
      if (isBlocked) break;

      // Realistic delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
      
      const currentStage = currentRun.stages[i];
      const updatedStage = simulateStage({ ...currentStage, status: 'running' });
      
      // Update intermediate state
      currentRun.stages[i] = updatedStage;
      updateRun(currentRun.id, { stages: [...currentRun.stages] });

      if (updatedStage.status === 'blocked') {
        isBlocked = true;
        updateRun(currentRun.id, { status: 'BLOCKED' });
        break;
      }

      totalFindings += updatedStage.findings.length;
    }

    if (!isBlocked) {
      const score = Math.max(0, 100 - (totalFindings * 5));
      updateRun(currentRun.id, { status: 'APPROVED', score });
    }
  })();

  return NextResponse.json(newRun);
}
