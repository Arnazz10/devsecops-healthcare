'use client';

import { ShieldAlert, Info, AlertOctagon, Monitor, ShieldCheck } from 'lucide-react';
import { Severity } from '@/lib/mockSecurityEngine';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  type: string;
  severity: Severity;
  service: string;
  description: string;
  status: 'Open' | 'Acknowledged' | 'Mitigated';
}

interface AlertFeedProps {
  alerts: SecurityAlert[];
  onAcknowledge?: (id: string) => void;
  onQuarantine?: (service: string) => void;
}

export default function AlertFeed({ alerts, onAcknowledge, onQuarantine }: AlertFeedProps) {
  const getSeverityStyles = (sev: Severity) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'LOW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  const getIcon = (sev: Severity) => {
    switch (sev) {
      case 'CRITICAL': return <AlertOctagon className="w-4 h-4" />;
      case 'HIGH':
      case 'MEDIUM': return <ShieldAlert className="w-4 h-4" />;
      case 'LOW': return <Info className="w-4 h-4" />;
      default: return <ShieldCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
          <p className="text-slate-500 text-sm">No active security alerts</p>
        </div>
      ) : (
        alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={cn(
              "p-4 border rounded-xl flex items-start gap-4 transition-all animate-in slide-in-from-top-4 duration-300",
              getSeverityStyles(alert.severity)
            )}
          >
            <div className="p-2 bg-white/5 rounded-lg shrink-0 mt-1">
              {getIcon(alert.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest opacity-80">{alert.type}</span>
                <span className="text-[10px] font-mono opacity-60 shrink-0">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-sm font-semibold mb-1 truncate">{alert.description}</p>
              <div className="flex items-center gap-2 text-[10px] font-mono opacity-70 mb-3">
                <Monitor className="w-3 h-3" />
                <span>{alert.service}</span>
              </div>
              
              <div className="flex gap-2">
                {alert.status === 'Open' ? (
                  <>
                  <button 
                    onClick={() => onAcknowledge?.(alert.id)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold uppercase transition-colors"
                  >
                    Acknowledge
                  </button>
                  {alert.severity === 'CRITICAL' && (
                    <button 
                      onClick={() => onQuarantine?.(alert.service)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold uppercase transition-colors"
                    >
                      Quarantine Pod
                    </button>
                  )}
                  </>
                ) : (
                  <span className="text-[10px] font-bold uppercase opacity-50 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> {alert.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
