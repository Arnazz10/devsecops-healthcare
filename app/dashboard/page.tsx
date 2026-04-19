'use client';

import { useEffect, useState } from 'react';
import PostureGauge from '@/components/PostureGauge';
import { Shield, GitBranch, ShieldAlert, FileCheck, Clock, CheckCircle2, XCircle, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { PipelineRun } from '@/lib/mockSecurityEngine';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const res = await fetch('/api/pipeline/runs');
        const data = await res.json();
        setRuns(data);
      } finally {
        setLoading(false);
      }
    };
    fetchRuns();
    const interval = setInterval(fetchRuns, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerPipeline = async () => {
    await fetch('/api/pipeline/trigger', { method: 'POST' });
  };

  const getStatusBadge = (status: PipelineRun['status']) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'BLOCKED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">Security Posture Oversight</h1>
          <p className="text-slate-500 text-sm">Real-time CI/CD gate monitoring and HIPAA compliance tracking.</p>
        </div>
        <button 
          onClick={triggerPipeline}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 flex items-center gap-2"
        >
          <GitBranch className="w-5 h-5" />
          Trigger Secure Pipeline
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:col-span-1 bg-[#111827] border border-[#1f2937] p-8 rounded-2xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <PostureGauge score={78} />
        </div>

        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ShieldAlert} label="Open CVEs" value="14" color="text-red-500" trend="+2" trendColor="text-red-500" />
          <StatCard icon={Shield} label="Secrets Detected" value="0" color="text-green-500" trend="0" trendColor="text-slate-500" />
          <StatCard icon={AlertCircle} label="Policy Violations" value="3" color="text-amber-500" trend="High" trendColor="text-amber-500" />
          <StatCard icon={CheckCircle2} label="Last Clean Build" value="4h 12m" color="text-blue-500" trend="MED-9921" trendColor="text-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-blue-500" />
              Recent Pipeline Runs
            </h2>
            <Link href="/dashboard" className="text-xs font-bold text-blue-400 hover:underline px-2 py-1">View All</Link>
          </div>
          
          <div className="border border-[#1f2937] bg-[#111827] rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a2333]/50 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">Build ID</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Security Score</th>
                  <th className="px-6 py-4 font-bold">Timestamp</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2937]">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-5 font-mono font-bold text-slate-200">#{run.id}</td>
                    <td className="px-6 py-5">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase border", getStatusBadge(run.status))}>
                        {run.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${run.score}%` }} />
                        </div>
                        <span className="font-mono text-xs font-bold">{run.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-xs font-mono">
                      {new Date(run.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-5">
                      <Link href={`/pipeline/${run.id}`}>
                        <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors group-hover:translate-x-1">
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Status & Alert Feed (Condensed) */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#111827] to-[#0a0e17] border border-amber-900/30 p-6 rounded-2xl shadow-xl shadow-amber-900/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <FileCheck className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-tight">HIPAA Audit Status</h3>
                <p className="text-[10px] font-mono text-amber-500 font-bold uppercase">At Risk - Overdue Scan</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
              Last major compliance audit was 14 days ago. 2 Critical CVEs detected in healthcare-prod namespace require patching.
            </p>
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-[10px] uppercase tracking-wider text-slate-300 transition-colors">
              Initialize Audit Report
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider px-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Real-time Alert Feed
            </h2>
            <div className="space-y-3">
              <MockAlert type="PHI Access Anomaly" sev="CRITICAL" time="2m ago" />
              <MockAlert type="Brute Force Attempt" sev="HIGH" time="15m ago" />
              <MockAlert type="Unauthorized Egress" sev="MEDIUM" time="1h ago" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend, trendColor }: any) {
  return (
    <div className="bg-[#111827]/50 backdrop-blur-xl border border-[#1f2937] p-5 rounded-2xl hover:border-slate-700 transition-all hover:translate-y-[-2px]">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2 rounded-lg bg-slate-900/50 border border-slate-800", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn("text-[10px] font-mono font-bold uppercase tracking-tighter", trendColor)}>{trend}</span>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</p>
        <p className={cn("text-2xl font-black font-mono tracking-tighter mt-0.5", color)}>{value}</p>
      </div>
    </div>
  );
}

function MockAlert({ type, sev, time }: any) {
  const sevColor = sev === 'CRITICAL' ? 'bg-red-500' : sev === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500';
  return (
    <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center gap-3">
      <div className={cn("w-1.5 h-8 rounded-full", sevColor)} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{type}</span>
          <span className="text-[10px] font-mono text-slate-600">{time}</span>
        </div>
        <p className="text-xs text-slate-500 truncate">Unauthorized access attempt in patient-records-pod</p>
      </div>
    </div>
  );
}
