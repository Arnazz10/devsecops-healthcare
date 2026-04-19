'use client';

import { useEffect, useState } from 'react';
import SecurityStage from '@/components/SecurityStage';
import BlockedBanner from '@/components/BlockedBanner';
import { PipelineRun } from '@/lib/mockSecurityEngine';
import { GitBranch, ShieldCheck, ShieldAlert, ArrowLeft, Clock, Server, Monitor } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PipelineDetailPage() {
  const { id } = useParams();
  const [run, setRun] = useState<PipelineRun | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const res = await fetch(`/api/pipeline/${id}`);
        const data = await res.json();
        setRun(data);
      } finally {
        setLoading(false);
      }
    };
    fetchRun();
    const interval = setInterval(fetchRun, 2000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading || !run) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Server className="w-12 h-12 text-slate-800 animate-pulse" />
        <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Retrieving Pipeline Data...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-0">
      {run.status === 'BLOCKED' && <BlockedBanner />}
      
      <div className="p-8 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-lg transition-colors group">
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-white" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black tracking-tight text-white uppercase">Build #{run.id}</h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase ${
                  run.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                  run.status === 'BLOCKED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                  'bg-blue-500/10 text-blue-500 border-blue-500/20'
                }`}>
                  {run.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(run.timestamp).toLocaleString()}</div>
                <div className="flex items-center gap-1.5"><Monitor className="w-3 h-3" /> Image: medguard-api:v3.2.1</div>
                <div className="flex items-center gap-1.5"><GitBranch className="w-3 h-3" /> main [f7c3a9]</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center min-w-[120px]">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Score</span>
              <span className={`text-2xl font-black font-mono ${run.score > 80 ? 'text-green-500' : run.score > 60 ? 'text-amber-500' : 'text-red-500'}`}>
                {run.score}
              </span>
            </div>
            {run.status === 'APPROVED' && (
              <button className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-green-900/20 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-tight text-sm">
                <ShieldCheck className="w-5 h-5" />
                Deploy to Production
              </button>
            )}
          </div>
        </div>

        <div className="max-w-4xl space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Secure Pipeline Gates</h2>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>
              <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Enforced</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {run.stages.map((stage) => (
              <SecurityStage key={stage.id} stage={stage} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
