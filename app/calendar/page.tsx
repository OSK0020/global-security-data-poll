"use client";

import { useState } from "react";
import { NewsTopic } from "@/types";
import Navigation from "@/components/Navigation";
import ScannerOverlay from "@/components/ScannerOverlay";
import { motion } from "framer-motion";

export default function CalendarPage() {
  const [currentTopic, setCurrentTopic] = useState<NewsTopic>("ALL");
  const [isScanning, setIsScanning] = useState(false);

  const handleTopicChange = (topic: NewsTopic) => {
    setCurrentTopic(topic);
  };

  const triggerScan = () => {
    setIsScanning(true);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
  };

  // Generate a mock month for the heatmap
  const generateMockMonth = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      // Random severity between 0 (no news) and 5 (critical)
      const severity = Math.floor(Math.random() * 6);
      days.push({ day: i, severity });
    }
    return days;
  };

  const mockMonth = generateMockMonth();

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 0: return "bg-gray-900/40 border-gray-800";
      case 1: return "bg-tactical-cyan/10 border-tactical-cyan/20";
      case 2: return "bg-tactical-cyan/30 border-tactical-cyan/40";
      case 3: return "bg-encrypted-amber/30 border-encrypted-amber/40";
      case 4: return "bg-alert-crimson/40 border-alert-crimson/50";
      case 5: return "bg-alert-crimson/70 border-alert-crimson shadow-[0_0_15px_rgba(255,42,42,0.6)] animate-pulse-glow";
      default: return "bg-gray-900/40 border-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative w-full selection:bg-alert-crimson/30 selection:text-alert-crimson">
      <ScannerOverlay isScanning={isScanning} onScanComplete={handleScanComplete} />
      
      <Navigation 
        currentTopic={currentTopic} 
        onTopicChange={handleTopicChange} 
        onScanTrigger={triggerScan} 
      />

      <main className="flex-1 w-full max-w-[1200px] mx-auto relative z-10 p-6 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl border border-gray-800 bg-black/60 p-8 rounded-sm backdrop-blur-md relative overflow-hidden"
        >
          {/* Black box aesthetic accents */}
          <div className="absolute top-0 left-0 w-16 h-1 bg-tactical-cyan/50" />
          <div className="absolute bottom-0 right-0 w-16 h-1 bg-alert-crimson/50" />
          
          <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-2xl font-mono text-gray-200 tracking-widest uppercase">Historical Archive</h2>
              <p className="text-xs font-mono text-gray-500 uppercase mt-1">Select a node to extract data</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-light font-sans text-tactical-cyan">MAR</span>
              <span className="text-sm font-mono text-gray-500 ml-2">2026</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {/* Days of week */}
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="text-center text-[10px] font-mono text-gray-600 mb-2">
                {day}
              </div>
            ))}
            
            {/* Empty slots for starting day offset (assuming month starts on a Wednesday for mock) */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square opacity-20" />
            ))}

            {/* Heatmap Days */}
            {mockMonth.map((data, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square flex items-center justify-center border transition-all duration-300 relative group ${getSeverityColor(data.severity)}`}
              >
                <span className="font-mono text-xs md:text-sm text-gray-300 z-10">{data.day}</span>
                
                {/* Hover bracket effect */}
                <div className="absolute inset-0 border border-white/0 group-hover:border-white/50 transition-colors pointer-events-none" />
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white/0 group-hover:border-white/80 transition-colors pointer-events-none" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white/0 group-hover:border-white/80 transition-colors pointer-events-none" />
              </motion.button>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-800 flex items-center justify-between font-mono text-xs text-gray-500">
            <span>INTENSITY LEGEND:</span>
            <div className="flex items-center gap-2">
              <span>LOW</span>
              <div className="w-4 h-4 bg-tactical-cyan/10 border border-tactical-cyan/20" />
              <div className="w-4 h-4 bg-tactical-cyan/30 border border-tactical-cyan/40" />
              <div className="w-4 h-4 bg-encrypted-amber/30 border border-encrypted-amber/40" />
              <div className="w-4 h-4 bg-alert-crimson/40 border border-alert-crimson/50" />
              <div className="w-4 h-4 bg-alert-crimson/70 border border-alert-crimson shadow-[0_0_5px_rgba(255,42,42,0.6)]" />
              <span>CRITICAL</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}