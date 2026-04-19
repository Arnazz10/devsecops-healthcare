'use client';

import { Ban, AlertTriangle, ShieldX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlockedBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-red-600 text-white px-6 py-4 flex items-center justify-center gap-4 border-b border-red-500 shadow-2xl relative z-50 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:50px_50px] animate-[pulse_2s_infinite]" />
      <div className="flex items-center gap-4 relative z-10">
        <Ban className="w-8 h-8 animate-bounce" />
        <div>
          <h2 className="text-lg font-black uppercase tracking-tighter">Deployment Blocked</h2>
          <p className="text-xs font-bold opacity-90 uppercase">Critical security finding detected. Pipeline termination enforced for HIPAA compliance.</p>
        </div>
        <ShieldX className="w-8 h-8 opacity-50 ml-4" />
      </div>
    </motion.div>
  );
}
