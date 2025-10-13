"use client";

import { motion } from "framer-motion";
import { useArena } from "@/context/ArenaContext";

export function RoundTimer() {
  const { state } = useArena();
  const { timeLeft, duration, isRunning } = state.roundState;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = isRunning ? (timeLeft / duration) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <div className="relative h-10 w-10">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth="4"
            fill="transparent"
          />
          <motion.circle
            cx="25"
            cy="25"
            r={radius}
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs">
            {isRunning ? `${minutes}:${seconds.toString().padStart(2, '0')}` : '0:00'}
            </span>
        </div>
      </div>
      <div className="hidden sm:block">
        <p className="text-xs text-muted-foreground">Round ends in</p>
        <p className="font-bold">
            {isRunning ? `${minutes}m ${seconds.toString().padStart(2, '0')}s` : 'Ended'}
        </p>
      </div>
    </div>
  );
}
