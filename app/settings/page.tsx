'use client';

import { Settings, Shield, Bell, Terminal, Zap, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-1">Control Plane Settings</h1>
        <p className="text-slate-500 text-sm">Configure scan thresholds, compliance modes, and notification hooks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <nav className="space-y-1">
            <SettingsItem icon={Shield} label="Scan Tools" active={true} />
            <SettingsItem icon={Bell} label="Notifications" active={false} />
            <SettingsItem icon={Globe} label="Compliance Mode" active={false} />
            <SettingsItem icon={Terminal} label="API Keys" active={false} />
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Section label="Scanner Configuration">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">SAST Tool Selector</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200">
                  <option>SonarQube Enterprise</option>
                  <option>Snyk Code</option>
                  <option>Checkmarx</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Trivy Severity Threshold</label>
                <div className="flex gap-4">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((s) => (
                    <button 
                      key={s}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black border transition-all ${s === 'HIGH' ? 'bg-orange-600 text-white border-orange-500' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">DAST Target URL</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200"
                  defaultValue="https://api.healthcare.prod/v3"
                />
              </div>
            </div>
          </Section>

          <Section label="Notification Hooks">
             <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4A154B] rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Slack Webhook</h4>
                    <p className="text-[10px] text-slate-500 font-mono">hooks.slack.com/services/T0123...</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-blue-400">Configure</button>
             </div>
          </Section>

          <div className="flex justify-end gap-4 pt-4">
            <button className="px-6 py-3 border border-slate-800 rounded-xl text-slate-400 font-bold text-sm hover:bg-slate-900 transition-colors">Discard</button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: any) {
  return (
    <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">{label}</h3>
      {children}
    </div>
  );
}

function SettingsItem({ icon: Icon, label, active }: any) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-100 hover:bg-[#1f2937]'}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-blue-400' : 'text-slate-600'}`} />
      {label}
    </button>
  );
}
