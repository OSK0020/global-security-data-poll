"use client";

import { NewsTopic } from "@/types";
import { motion } from "framer-motion";
import { Radar, Calendar as CalendarIcon, Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  currentTopic: NewsTopic;
  onTopicChange: (topic: NewsTopic) => void;
  onScanTrigger: () => void;
}

export default function Navigation({ currentTopic, onTopicChange, onScanTrigger }: NavigationProps) {
  const pathname = usePathname();
  const topics: { id: NewsTopic; label: string }[] = [
    { id: "ALL", label: "ALL INTEL" },
    { id: "CYBER", label: "CYBER THREATS" },
    { id: "GEOPOLITICS", label: "GEOPOLITICS" },
    { id: "DEFENSE", label: "MILITARY/DEFENSE" },
  ];

  return (
    <header className="w-full border-b border-white/10 bg-void/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo & Scan */}
        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center border border-tactical-cyan/50 bg-tactical-cyan/10">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                <Radar size={16} className="text-tactical-cyan" />
              </motion.div>
            </div>
            <div>
              <h1 className="font-mono text-tactical-cyan font-bold tracking-[0.2em] text-lg leading-none">OSN</h1>
              <p className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">Intel Node</p>
            </div>
          </div>

          <button
            onClick={onScanTrigger}
            className="group relative px-6 py-2 border border-tactical-cyan text-tactical-cyan font-mono text-xs uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-tactical-cyan hover:text-void shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.6)]"
          >
            <span className="relative z-10 font-bold">Initiate Scan</span>
            <div className="absolute inset-0 bg-tactical-cyan/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>

        {/* Tactical Toggles */}
        <div className="flex items-center gap-2 bg-black/50 p-1 border border-white/5 rounded-sm overflow-x-auto w-full md:w-auto scrollbar-none">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => onTopicChange(t.id)}
              className={`relative px-4 py-1.5 font-mono text-[10px] md:text-xs tracking-widest uppercase transition-colors whitespace-nowrap ${
                currentTopic === t.id
                  ? "text-void bg-gray-200"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {currentTopic === t.id && (
                <motion.div
                  layoutId="activeToggle"
                  className="absolute inset-0 bg-gray-200 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {t.id === currentTopic ? "[x] " : "[ ] "}{t.label}
            </button>
          ))}
        </div>

        {/* View Switcher (Today / Calendar) */}
        <div className="flex items-center gap-4 font-mono text-xs tracking-widest ml-auto md:ml-0">
          <Link
            href="/"
            className={`flex items-center gap-2 transition-colors ${pathname === "/" ? "text-tactical-cyan" : "text-gray-500 hover:text-gray-300"}`}
          >
            <Clock size={14} /> TODAY
          </Link>
          <span className="text-gray-700">|</span>
          <Link
            href="/calendar"
            className={`flex items-center gap-2 transition-colors ${pathname === "/calendar" ? "text-tactical-cyan" : "text-gray-500 hover:text-gray-300"}`}
          >
            <CalendarIcon size={14} /> ARCHIVE
          </Link>
        </div>

      </div>
    </header>
  );
}