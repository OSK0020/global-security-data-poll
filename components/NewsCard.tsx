"use client";

import { NewsItem } from "@/types";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Lock, Terminal, ShieldAlert, Globe, Orbit } from "lucide-react";

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [scrambledTitle, setScrambledTitle] = useState(item.title);
  
  // Visual DNA Mapping based on source
  const getDNA = () => {
    switch (item.source) {
      case "REUTERS":
      case "BBC":
      case "AP":
        return {
          wrapper: "border-blue-500/30 bg-blue-900/5 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]",
          header: "text-blue-400 font-sans",
          title: "text-gray-100 font-sans tracking-tight",
          icon: <Globe size={14} className="text-blue-400" />,
          accent: "bg-blue-500",
          font: "font-sans"
        };
      case "HACKER_NEWS":
      case "DARK_READING":
        return {
          wrapper: "border-terminal-green/30 bg-terminal-green/5 hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] relative overflow-hidden group",
          header: "text-terminal-green font-mono uppercase",
          title: "text-gray-200 font-mono tracking-tight",
          icon: <Terminal size={14} className="text-terminal-green" />,
          accent: "bg-terminal-green",
          font: "font-mono"
        };
      case "DEFENSE_NEWS":
        return {
          wrapper: "border-[#b0b0b0]/20 bg-[#1a1a1a] hover:border-encrypted-amber/50 hover:shadow-[0_0_15px_rgba(255,184,0,0.15)] rounded-sm",
          header: "text-encrypted-amber font-mono uppercase tracking-widest",
          title: "text-white font-sans uppercase font-bold",
          icon: <ShieldAlert size={14} className="text-encrypted-amber" />,
          accent: "bg-encrypted-amber",
          font: "font-sans"
        };
      case "AL_JAZEERA":
        return {
          wrapper: "border-alert-crimson/20 bg-black hover:border-alert-crimson/50 hover:shadow-[0_0_20px_rgba(255,42,42,0.15)]",
          header: "text-alert-crimson font-mono uppercase",
          title: "text-gray-100 font-serif",
          icon: <Globe size={14} className="text-alert-crimson" />,
          accent: "bg-alert-crimson",
          font: "font-serif"
        };
      case "SPACE":
        return {
          wrapper: "border-purple-500/20 bg-[#0a0514] hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] rounded-3xl",
          header: "text-purple-400 font-sans tracking-widest uppercase text-xs",
          title: "text-gray-100 font-sans font-light",
          icon: <Orbit size={14} className="text-purple-400" />,
          accent: "bg-purple-500",
          font: "font-sans"
        };
      default:
        return {
          wrapper: "border-white/10 bg-white/5",
          header: "text-gray-400 font-mono",
          title: "text-gray-200",
          icon: <Globe size={14} />,
          accent: "bg-gray-500",
          font: "font-sans"
        };
    }
  };

  const dna = getDNA();

  // Decryption Effect Logic
  useEffect(() => {
    if (isHovered) {
      let iteration = 0;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      const interval = setInterval(() => {
        setScrambledTitle(prev => 
          item.title
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return item.title[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        
        if (iteration >= item.title.length) {
          clearInterval(interval);
        }
        
        iteration += 2; // Speed of decryption
      }, 30);
      
      return () => clearInterval(interval);
    } else {
      setScrambledTitle(item.title);
    }
  }, [isHovered, item.title]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full p-5 border backdrop-blur-md transition-all duration-500 ${dna.wrapper}`}
    >
      {/* Background Matrix/Glitch effect for Cyber */}
      {(item.source === "HACKER_NEWS" || item.source === "DARK_READING") && isHovered && (
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDBmZjQxIi8+PC9zdmc+')] animate-pulse" />
      )}

      {/* Header: Time & Source */}
      <div className={`flex items-center gap-3 mb-3 text-xs ${dna.header}`}>
        <span className="font-bold opacity-70">[{item.timestamp}]</span>
        {dna.icon}
        <span className="tracking-widest">{item.source.replace("_", " ")}</span>
      </div>

      {/* Title */}
      <h3 className={`text-xl md:text-2xl mb-4 leading-tight min-h-[3rem] ${dna.title}`}>
        {isHovered ? scrambledTitle : item.title}
      </h3>

      {/* Intelligence Brief (Revealed on Hover) */}
      <motion.div
        initial={false}
        animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className={`pt-4 border-t border-white/10 space-y-2 mb-6 ${dna.font}`}>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase mb-3">
            <Lock size={12} /> AI Decrypted Brief
          </div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${dna.accent}`} />
              <span className="leading-relaxed">{item.brief.point1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${dna.accent}`} />
              <span className="leading-relaxed">{item.brief.point2}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${dna.accent}`} />
              <span className="leading-relaxed">{item.brief.point3}</span>
            </li>
          </ul>
        </div>

        {/* Source Link */}
        <a 
          href={item.originalUrl} 
          className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest ${dna.header} hover:brightness-150 transition-all`}
        >
          [ Source Intercepted ] <ArrowRight size={14} />
        </a>
      </motion.div>

      {/* Left glowing accent line */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${dna.accent} opacity-50 group-hover:opacity-100 transition-opacity`} />
    </motion.div>
  );
}