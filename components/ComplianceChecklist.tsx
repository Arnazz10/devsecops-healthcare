'use client';

import { ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink } from 'lucide-react';
import { HIPAAControl } from '@/lib/hipaaControls';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ComplianceChecklist({ controls }: { controls: HIPAAControl[] }) {
  const getStatusIcon = (status: HIPAAControl['status']) => {
    switch (status) {
      case 'Pass': return <ShieldCheck className="w-5 h-5 text-green-500" />;
      case 'Fail': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: HIPAAControl['status']) => {
    switch (status) {
      case 'Pass': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Fail': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Warning': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 font-bold">Control ID</th>
            <th className="px-6 py-4 font-bold">Requirement</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 font-bold">Last Verified</th>
            <th className="px-6 py-4 font-bold">Artifacts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {controls.map((control) => (
            <tr key={control.id} className="hover:bg-slate-900/50 transition-colors group">
              <td className="px-6 py-4 font-mono font-bold text-slate-100">{control.id}</td>
              <td className="px-6 py-4">
                <div className="max-w-md">
                  <p className="font-semibold text-slate-200">{control.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 group-hover:line-clamp-none">{control.description}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(control.status)}
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-black border uppercase", getStatusBadge(control.status))}>
                    {control.status}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                {new Date(control.lastChecked).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <button className="flex items-center gap-1 text-slate-400 hover:text-white text-xs font-bold transition-colors">
                  View Evidence <ExternalLink className="w-3 h-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
