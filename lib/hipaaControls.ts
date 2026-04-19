export interface HIPAAControl {
  id: string;
  name: string;
  status: 'Pass' | 'Fail' | 'Warning';
  lastChecked: string;
  description: string;
}

export const hipaaControls: HIPAAControl[] = [
  {
    id: 'HCF-01',
    name: 'PHI Encryption at Rest',
    status: 'Pass',
    lastChecked: new Date().toISOString(),
    description: 'Ensure all Personal Health Information (PHI) is encrypted using AES-256 for data at rest in RDS and S3.'
  },
  {
    id: 'HCF-02',
    name: 'PHI Encryption in Transit',
    status: 'Pass',
    lastChecked: new Date().toISOString(),
    description: 'TLS 1.2+ forced on all load balancers and inter-service communication.'
  },
  {
    id: 'HCF-03',
    name: 'Access Logging Enabled',
    status: 'Pass',
    lastChecked: new Date().toISOString(),
    description: 'CloudTrail and application-level audit logs are enabled and streamed to a secure vault.'
  },
  {
    id: 'HCF-04',
    name: 'No PHI in Logs',
    status: 'Pass',
    lastChecked: new Date().toISOString(),
    description: 'Automated log scrubbing to remove SSN, DOB, and patient names from application stdout.'
  },
  {
    id: 'HCF-05',
    name: 'MFA on All Services',
    status: 'Pass',
    lastChecked: new Date().toISOString(),
    description: 'Multi-factor authentication required for AWS Console, VPN, and internal dashboards.'
  },
  {
    id: 'HCF-06',
    name: 'Image Signed & Verified',
    status: 'Pass',
    lastChecked: new Date().toISOString(),
    description: 'Docker images must be signed by Cosign and verified by the admission controller before deployment.'
  },
  {
    id: 'HCF-07',
    name: 'Secrets in Vault',
    status: 'Warning',
    lastChecked: new Date().toISOString(),
    description: 'Some environment variables were found in CI configs. Migration to HashiCorp Vault is 85% complete.'
  },
  {
    id: 'HCF-08',
    name: 'Pod Security Policy Active',
    status: 'Pass',
    lastChecked: new Date().toISOString(),
    description: 'Restricts privileged containers and ensures non-root execution via OPA Gatekeeper.'
  },
  {
    id: 'HCF-09',
    name: 'Audit Trail Enabled',
    status: 'Pass',
    lastChecked: new Date().toISOString(),
    description: 'Maintain a 6-year retention policy for all access and modification logs.'
  },
  {
    id: 'HCF-10',
    name: 'Vulnerability SLA Met',
    status: 'Fail',
    lastChecked: new Date().toISOString(),
    description: 'Critical vulnerabilities (CVE-2024-3094) found in staging have not been patched within the 7-day window.'
  }
];
