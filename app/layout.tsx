'use client';

import './globals.css';

import { motion } from 'framer-motion';

import { 
  LayoutDashboard, 
  GitBranch, 
  ShieldAlert, 
  FileCheck, 
  Bell, 
  Settings, 
  ShieldCheck,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pipelines', href: '/dashboard', icon: GitBranch }, // Reusing dashboard for list for now
  { name: 'Vulnerabilities', href: '/vulnerabilities', icon: ShieldAlert },
  { name: 'Compliance', href: '/compliance', icon: FileCheck },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0e17] text-slate-200 font-sans selection:bg-blue-500/30">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r border-[#1f2937] bg-[#111827] flex flex-col fixed h-full inset-y-0">
            <div className="p-6 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-white">MEDGUARD</h1>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
              <div className="px-4 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Core Navigation</span>
              </div>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group relative",
                      isActive 
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                        : "text-slate-500 hover:text-slate-100 hover:bg-[#1f2937]/50"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="nav-active"
                        className="absolute left-0 w-1 h-5 bg-blue-500 rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-blue-400" : "text-slate-600 group-hover:text-slate-300")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 mt-auto">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner group">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-500 group-hover:animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Status</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">HIPAA-NODE-01</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-green-500 uppercase font-black tracking-tighter">SECURE</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
