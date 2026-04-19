export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'PASS';

export interface Finding {
  id: string;
  type: string;
  severity: Severity;
  package?: string;
  cveId?: string;
  description: string;
  fixVersion?: string;
  status: 'Open' | 'In Review' | 'Patched';
  daysOpen: number;
}

export interface PipelineStage {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'blocked';
  findings: Finding[];
  duration: string;
  logs: string[];
}

export interface PipelineRun {
  id: string;
  timestamp: string;
  status: 'APPROVED' | 'BLOCKED' | 'IN_PROGRESS';
  stages: PipelineStage[];
  score: number;
}

const MOCK_CVES = [
  { id: 'CVE-2024-3094', pkg: 'liblzma', sev: 'CRITICAL', fix: '5.6.1-r1' },
  { id: 'CVE-2023-44487', pkg: 'nghttp2', sev: 'HIGH', fix: '1.57.0' },
  { id: 'CVE-2024-21626', pkg: 'runc', sev: 'CRITICAL', fix: '1.1.12' },
  { id: 'CVE-2023-50164', pkg: 'apache-struts', sev: 'MEDIUM', fix: '6.3.0.2' },
  { id: 'CVE-2024-23897', pkg: 'jenkins-core', sev: 'HIGH', fix: '2.442' },
];

export const generatePipeline = (id?: string): PipelineRun => {
  const runId = id || Math.random().toString(36).substring(7).toUpperCase();
  
  const stages: PipelineStage[] = [
    { id: 1, name: 'Source Checkout', status: 'completed', duration: '1.2s', findings: [], logs: ['Cloning repo...', 'Commit: f7c3a9 (main)', 'Author: arnab'] },
    { id: 2, name: 'SAST Scan', status: 'pending', duration: '0s', findings: [], logs: [] },
    { id: 3, name: 'Dependency Scan', status: 'pending', duration: '0s', findings: [], logs: [] },
    { id: 4, name: 'Docker Build', status: 'pending', duration: '0s', findings: [], logs: [] },
    { id: 5, name: 'Image Scan (Trivy)', status: 'pending', duration: '0s', findings: [], logs: [] },
    { id: 6, name: 'Secrets Detection', status: 'pending', duration: '0s', findings: [], logs: [] },
    { id: 7, name: 'K8s Policy Gate', status: 'pending', duration: '0s', findings: [], logs: [] },
    { id: 8, name: 'DAST Scan', status: 'pending', duration: '0s', findings: [], logs: [] },
  ];

  return {
    id: runId,
    timestamp: new Date().toISOString(),
    status: 'IN_PROGRESS',
    stages,
    score: 0
  };
};

export const simulateStage = (stage: PipelineStage): PipelineStage => {
  const duration = (Math.random() * 3 + 1).toFixed(1) + 's';
  let status: PipelineStage['status'] = 'completed';
  const findings: Finding[] = [];
  const logs: string[] = [`Starting ${stage.name}...`];

  switch (stage.name) {
    case 'SAST Scan':
      if (Math.random() > 0.7) {
        findings.push({
          id: `SAST-${Math.random().toString(36).substring(7)}`,
          type: 'Static Analysis',
          severity: 'MEDIUM',
          description: 'Possible SQL Injection in patient records query',
          status: 'Open',
          daysOpen: Math.floor(Math.random() * 10)
        });
      }
      break;
    case 'Dependency Scan':
      const cveCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < cveCount; i++) {
        const cve = MOCK_CVES[Math.floor(Math.random() * MOCK_CVES.length)];
        findings.push({
          id: `CVE-${i}-${Math.random().toString(36).substring(7)}`,
          type: 'SCA',
          severity: cve.sev as Severity,
          cveId: cve.id,
          package: cve.pkg,
          description: `Vulnerability found in ${cve.pkg}`,
          fixVersion: cve.fix,
          status: 'Open',
          daysOpen: Math.floor(Math.random() * 12)
        });
      }
      break;
    case 'Image Scan (Trivy)':
      findings.push({
        id: `IMG-${Math.random().toString(36).substring(7)}`,
        type: 'Container Security',
        severity: 'HIGH',
        description: 'Vulnerable base image: node:18-alpine has 12 known vulnerabilities',
        status: 'Open',
        daysOpen: 4
      });
      break;
    case 'Secrets Detection':
      if (Math.random() > 0.9) {
        findings.push({
          id: `SEC-${Math.random().toString(36).substring(7)}`,
          type: 'Secret Leak',
          severity: 'CRITICAL',
          description: 'Hardcoded AWS Access Key found in .env.production',
          status: 'Open',
          daysOpen: 1
        });
      }
      break;
    case 'K8s Policy Gate':
      logs.push('Checking OPA policies...');
      logs.push('PASS: No root containers');
      logs.push('PASS: Resource limits set');
      if (Math.random() > 0.8) {
        status = 'blocked';
        findings.push({
          id: `POL-${Math.random().toString(36).substring(7)}`,
          type: 'Compliance',
          severity: 'CRITICAL',
          description: 'Privileged pod detected in healthcare-prod namespace',
          status: 'Open',
          daysOpen: 2
        });
      }
      break;
    case 'DAST Scan':
      logs.push('Fuzzing /api/patients...');
      logs.push('Fuzzing /api/records...');
      break;
  }

  const hasCritical = findings.some(f => f.severity === 'CRITICAL');
  if (hasCritical) {
    status = 'blocked';
  }

  return { ...stage, status, duration, findings, logs: [...logs, `Stage ${status}`] };
};
