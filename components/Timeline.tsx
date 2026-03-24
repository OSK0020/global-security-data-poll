"use client";

import { NewsItem } from "@/types";
import NewsCard from "./NewsCard";

export default function Timeline({ data }: { data: NewsItem[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 font-mono text-tactical-cyan/50">
        <p className="animate-pulse">AWAITING INTEL...</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto py-12">
      {/* Central Glowing Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-tactical-cyan/20 -translate-x-1/2">
        <div className="absolute top-0 bottom-0 left-0 w-full bg-tactical-cyan blur-sm opacity-30" />
      </div>

      <div className="space-y-12">
        {data.map((item, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div key={item.id} className="relative flex items-center md:justify-between w-full">
              {/* Timeline Node Point */}
              <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-void border-2 border-tactical-cyan rounded-full -translate-x-1/2 z-10 shadow-neon-cyan" />

              {/* Connecting Line (Mobile) */}
              <div className="absolute left-4 md:hidden w-8 h-px bg-tactical-cyan/30 z-0" />

              {/* Content Wrapper */}
              <div className={`w-full pl-12 md:pl-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-8 md:text-right' : 'md:ml-auto md:pl-8'}`}>
                <NewsCard item={item} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}