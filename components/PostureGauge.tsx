'use client';

import { motion } from 'framer-motion';

interface PostureGaugeProps {
  score: number;
  size?: number;
}

export default function PostureGauge({ score, size = 200 }: PostureGaugeProps) {
  const radius = size / 2 - 25;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#22c55e'; // Green
    if (s >= 60) return '#eab308'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg 
        viewBox={`0 0 ${size} ${size}`} 
        className="transform -rotate-90 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
        width={size} 
        height={size}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#111827"
          strokeWidth="12"
          fill="transparent"
        />
        {/* Progress Circle with Glow */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth="12"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="transparent"
          style={{ filter: `drop-shadow(0 0 8px ${getColor(score)}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span 
          className="text-6xl font-black font-mono tracking-tighter leading-none" 
          style={{ 
            color: getColor(score),
            textShadow: `0 0 20px ${getColor(score)}33`
          }}
        >
          {score}
        </span>
        <span className="text-[9px] uppercase text-slate-400 font-bold tracking-[0.2em] mt-2 translate-y-1">
          Security Index
        </span>
      </div>
    </div>
  );
}
