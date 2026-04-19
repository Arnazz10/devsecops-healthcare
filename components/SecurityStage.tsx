'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { PipelineStage, Severity } from '@/lib/mockSecurityEngine';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SecurityStage({ stage }: { stage: PipelineStage }) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusIcon = () => {
    switch (stage.status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
      case 'blocked': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running': return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      default: return <Clock className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'LOW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  return (
    <div className={cn(
      "border rounded-xl transition-all duration-200 overflow-hidden",
      stage.status === 'blocked' ? "border-red-900/50 bg-red-950/10" : "border-slate-800 bg-slate-900/50"
    )}>
      <div 
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-slate-100">{stage.name}</h3>
            <p className="text-xs text-slate-500 font-mono">{stage.duration}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {stage.findings.length > 0 && (
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border",
              stage.findings.some(f => f.severity === 'CRITICAL') ? "border-red-500 text-red-500 bg-red-500/10" : "border-amber-500 text-amber-500 bg-amber-500/10"
            )}>
              {stage.findings.length} Findings
            </span>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-800">
          <div className="space-y-4">
            {stage.findings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Vulnerabilities Detected</h4>
                {stage.findings.map((finding) => (
                  <div key={finding.id} className={cn("p-3 border rounded-lg flex justify-between items-start", getSeverityColor(finding.severity))}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold tracking-tight">{finding.cveId || finding.id}</span>
                        <span className="text-[10px] uppercase font-black opacity-80">{finding.severity}</span>
                      </div>
                      <p className="text-sm font-medium">{finding.description}</p>
                      {finding.package && <p className="text-xs opacity-70 mt-1 font-mono">Package: {finding.package} {finding.fixVersion ? `→ Fix: ${finding.fixVersion}` : ''}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Logs</h4>
              <div className="bg-slate-950 rounded-lg p-3 font-mono text-[11px] text-slate-400 space-y-1 overflow-x-auto">
                {stage.logs.map((log, i) => (
                  <div key={i}><span className="text-slate-600 mr-2">[{i + 1}]</span>{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
