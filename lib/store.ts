import { PipelineRun, Finding, generatePipeline } from './mockSecurityEngine';
import { HIPAAControl, hipaaControls } from './hipaaControls';

interface GlobalStore {
  runs: PipelineRun[];
  vulnerabilities: Finding[];
  compliance: HIPAAControl[];
  alerts: any[];
}

// In-memory store for demo purposes
const globalStore: GlobalStore = {
  runs: [
    {
      id: 'MED-9921',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'APPROVED',
      score: 92,
      stages: []
    },
    {
      id: 'MED-8812',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'BLOCKED',
      score: 45,
      stages: []
    }
  ],
  vulnerabilities: [],
  compliance: hipaaControls,
  alerts: []
};

export const getStore = () => globalStore;

export const addRun = (run: PipelineRun) => {
  globalStore.runs.unshift(run);
  return run;
};

export const updateRun = (id: string, updates: Partial<PipelineRun>) => {
  const index = globalStore.runs.findIndex(r => r.id === id);
  if (index !== -1) {
    globalStore.runs[index] = { ...globalStore.runs[index], ...updates };
    
    // Sync findings
    const allFindings = globalStore.runs.flatMap(r => r.stages.flatMap(s => s.findings));
    globalStore.vulnerabilities = allFindings;
  }
};
