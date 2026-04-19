'use client';

import { useEffect, useState } from 'react';
import CVETable from '@/components/CVETable';
import { Finding } from '@/lib/mockSecurityEngine';
import { ShieldAlert, Download, RefreshCw } from 'lucide-react';

export default function VulnerabilitiesPage() {
  const [vulnerabilities, setVulnerabilities] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVulnerabilities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vulnerabilities');
      const data = await res.json();
      setVulnerabilities(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVulnerabilities();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">Vulnerability Management</h1>
          <p className="text-slate-500 text-sm">Consolidated view of CVEs and static analysis findings across all HIPAA nodes.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchVulnerabilities}
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="bg-slate-100 hover:bg-white text-[#0a0e17] font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SeverityStats label="Critical" count={vulnerabilities.filter(v => v.severity === 'CRITICAL').length} color="text-red-500" bg="bg-red-500/10" />
        <SeverityStats label="High" count={vulnerabilities.filter(v => v.severity === 'HIGH').length} color="text-orange-500" bg="bg-orange-500/10" />
        <SeverityStats label="Medium" count={vulnerabilities.filter(v => v.severity === 'MEDIUM').length} color="text-amber-500" bg="bg-amber-500/10" />
      </div>

      <CVETable vulnerabilities={vulnerabilities} />
    </div>
  );
}

function SeverityStats({ label, count, color, bg }: any) {
  return (
    <div className={`p-6 border border-slate-800 rounded-2xl ${bg}`}>
      <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className={`text-3xl font-black font-mono tracking-tighter ${color}`}>{count}</p>
    </div>
  );
}
