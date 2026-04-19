'use client';

import { useState } from 'react';
import { Finding, Severity } from '@/lib/mockSecurityEngine';
import { Search, Filter, ExternalLink, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CVETable({ vulnerabilities }: { vulnerabilities: Finding[] }) {
  const [filter, setFilter] = useState<'ALL' | Severity>('ALL');
  const [search, setSearch] = useState('');

  const filtered = vulnerabilities.filter(v => {
    const matchesFilter = filter === 'ALL' || v.severity === filter;
    const matchesSearch = v.cveId?.toLowerCase().includes(search.toLowerCase()) || 
                         v.package?.toLowerCase().includes(search.toLowerCase()) ||
                         v.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSevBadge = (sev: Severity) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'LOW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search CVE ID or package..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto max-w-full">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={cn(
                "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                filter === s ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">CVE ID</th>
              <th className="px-6 py-4 font-bold">Package</th>
              <th className="px-6 py-4 font-bold">Severity</th>
              <th className="px-6 py-4 font-bold">SLA Status</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-slate-900/50 transition-colors group">
                <td className="px-6 py-4 font-mono font-bold text-slate-100">{v.cveId || 'SAST-ID'}</td>
                <td className="px-6 py-4 text-slate-400">{v.package || 'Source Code'}</td>
                <td className="px-6 py-4">
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-black border uppercase", getSevBadge(v.severity))}>
                    {v.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-col">
                      <span className={cn("text-[10px] font-bold uppercase", v.daysOpen > 7 && v.severity === 'CRITICAL' ? "text-red-500" : "text-green-500")}>
                        {v.daysOpen} days open
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono">SLA: {v.severity === 'CRITICAL' ? '< 7d' : '< 14d'}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-slate-500">{v.status}</td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-bold transition-colors">
                    Details <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-500 italic">No vulnerabilities found matching criteria.</div>
        )}
      </div>
    </div>
  );
}
