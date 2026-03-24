"use client";

import { useState } from "react";
import { NewsTopic, NewsItem } from "@/types";
import Navigation from "@/components/Navigation";
import ScannerOverlay from "@/components/ScannerOverlay";
import Timeline from "@/components/Timeline";
import mockData from "@/data/mock-news.json";

export default function Home() {
  const [currentTopic, setCurrentTopic] = useState<NewsTopic>("ALL");
  const [isScanning, setIsScanning] = useState(false);
  const [newsData, setNewsData] = useState<NewsItem[]>(mockData as NewsItem[]);

  const handleTopicChange = (topic: NewsTopic) => {
    setCurrentTopic(topic);
    // In a real app, this might trigger a fetch. Here we just filter the mock data.
    if (topic === "ALL") {
      setNewsData(mockData as NewsItem[]);
    } else {
      setNewsData((mockData as NewsItem[]).filter(item => item.topic === topic));
    }
  };

  const triggerScan = () => {
    setIsScanning(true);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    // After scan, maybe we would refresh the data.
    // For now, we just reset the filter to ALL to simulate "new" data arriving.
    handleTopicChange(currentTopic);
  };

  return (
    <div className="min-h-screen flex flex-col relative w-full selection:bg-tactical-cyan/30 selection:text-tactical-cyan">
      <ScannerOverlay isScanning={isScanning} onScanComplete={handleScanComplete} />
      
      <Navigation 
        currentTopic={currentTopic} 
        onTopicChange={handleTopicChange} 
        onScanTrigger={triggerScan} 
      />

      <main className="flex-1 w-full max-w-[1600px] mx-auto relative z-10">
        <Timeline data={newsData} />
      </main>
    </div>
  );
}