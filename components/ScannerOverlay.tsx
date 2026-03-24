"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ScannerOverlay({ isScanning, onScanComplete }: { isScanning: boolean, onScanComplete: () => void }) {
  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        onScanComplete();
      }, 2500); // 2.5 seconds scan duration
      return () => clearTimeout(timer);
    }
  }, [isScanning, onScanComplete]);

  if (!isScanning) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden bg-void/80 backdrop-blur-sm">
      {/* Horizontal Scanning Line */}
      <motion.div
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 2.5, ease: "linear" }}
        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-tactical-cyan/40 to-transparent border-b-2 border-tactical-cyan shadow-[0_0_40px_rgba(0,240,255,0.8)]"
      />
      
      {/* Central Targeting Reticle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-64 h-64 border border-tactical-cyan/30 rounded-full flex items-center justify-center relative"
        >
          <div className="w-48 h-48 border border-tactical-cyan/50 rounded-full border-dashed" />
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-tactical-cyan/40" />
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-tactical-cyan/40" />
          
          <div className="absolute bg-void px-2 font-mono text-tactical-cyan text-sm tracking-[0.3em] uppercase animate-pulse">
            Intercepting Data...
          </div>
        </motion.div>
      </div>

      {/* Edge Data Overlay */}
      <div className="absolute top-8 left-8 font-mono text-xs text-tactical-cyan/70 space-y-1">
        <p>SYS_PROT: ALPHA-7</p>
        <p>FREQ: 144.2 MHz</p>
        <motion.p
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.2, repeat: Infinity }}
        >
          LOCATING NODES
        </motion.p>
      </div>
    </div>
  );
}