'use client';

import { useEffect, useState } from 'react';
import ComplianceChecklist from '@/components/ComplianceChecklist';
import { HIPAAControl } from '@/lib/hipaaControls';
import { FileCheck, ShieldCheck, Download, Printer } from 'lucide-react';

export default function CompliancePage() {
  const [controls, setControls] = useState<HIPAAControl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const res = await fetch('/api/compliance');
        const data = await res.json();
        setControls(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCompliance();
  }, []);

  const passCount = controls.filter(c => c.status === 'Pass').length;
  const totalCount = controls.length;
  const score = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

  const exportReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(controls, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "medguard-hipaa-report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">HIPAA Compliance Registry</h1>
          <p className="text-slate-500 text-sm">Automated evidence collection and technical control verification.</p>
        </div>
        <div className="flex gap-4">
          <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
            <Printer className="w-5 h-5 text-slate-400" />
          </button>
          <button 
            onClick={exportReport}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20"
          >
            <Download className="w-5 h-5" />
            Generate Audit Pack (JSON)
          </button>
        </div>
      </div>

      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative flex items-center justify-center">
             <div className="w-32 h-32 rounded-full border-8 border-slate-800 flex items-center justify-center">
                <span className="text-3xl font-black font-mono text-white">{score}%</span>
             </div>
             <svg className="absolute w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke={score > 80 ? '#22c55e' : score > 60 ? '#eab308' : '#ef4444'}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={326.7}
                  strokeDashoffset={326.7 - (score / 100) * 326.7}
                  strokeLinecap="round"
                />
             </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              Overall HIPAA Readiness
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              MedGuard has verified {passCount} of {totalCount} technical controls. Automated scanning detected a failure in Vulnerability SLA ({"<"}7 days for Critical). Immediate remediation required for full compliance.
            </p>
          </div>
        </div>
      </div>

      <ComplianceChecklist controls={controls} />
    </div>
  );
}
