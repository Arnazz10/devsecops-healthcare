'use client';

import { useEffect, useState } from 'react';
import AlertFeed, { SecurityAlert } from '@/components/AlertFeed';
import { Bell, ShieldAlert, Zap, Search, Ban } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const eventSource = new EventSource('/api/alerts');
    
    eventSource.onmessage = (event) => {
      const newAlert = JSON.parse(event.data);
      setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Acknowledged' } : a));
  };

  const handleQuarantine = (service: string) => {
    setAlerts(prev => prev.map(a => a.service === service ? { ...a, status: 'Mitigated', description: `[QUARANTINED] ${a.description}` } : a));
    alert(`Cordoning and isolating pod for service: ${service}`);
  };

  const triggerAttack = () => {
    const attack = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      type: 'PHI Access Anomaly',
      severity: 'CRITICAL',
      service: 'patient-records-api',
      description: 'UNAUTHORIZED: Mass data export attempt detected from internal IP 10.0.1.4',
      status: 'Open'
    };
    setAlerts(prev => [attack as SecurityAlert, ...prev]);
  };

  const filtered = alerts.filter(a => 
    a.description.toLowerCase().includes(search.toLowerCase()) || 
    a.service.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">Security Event Stream</h1>
          <p className="text-slate-500 text-sm">Real-time anomaly detection and runtime policy enforcement feed.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={triggerAttack}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 animate-pulse shadow-lg shadow-red-900/40"
          >
            <Zap className="w-5 h-5" />
            Simulate Attack
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Search & Filters</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search alerts..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2">
               <FilterButton label="Critical" count={alerts.filter(a => a.severity === 'CRITICAL').length} active={true} />
               <FilterButton label="High" count={alerts.filter(a => a.severity === 'HIGH').length} active={false} />
               <FilterButton label="In Review" count={alerts.filter(a => a.status === 'Open').length} active={false} />
            </div>
          </div>

          <div className="p-6 bg-red-950/10 border border-red-900/30 rounded-2xl">
            <div className="flex items-center gap-3 mb-2 text-red-500">
              <Ban className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-tight">Active Quarantine</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              No pods are currently isolated. Emergency lockdown is available for any CRITICAL severity event.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <AlertFeed 
            alerts={filtered} 
            onAcknowledge={handleAcknowledge}
            onQuarantine={handleQuarantine}
          />
        </div>
      </div>
    </div>
  );
}

function FilterButton({ label, count, active }: any) {
  return (
    <button className={`w-full flex justify-between items-center px-4 py-2 rounded-lg text-xs font-bold transition-colors ${active ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-800/50'}`}>
      <span>{label}</span>
      <span className="font-mono opacity-60">{count}</span>
    </button>
  );
}
