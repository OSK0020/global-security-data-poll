"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import archiveData from "@/data/archive.json";

export default function CalendarArchive() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = archiveData.articles.filter((article) => {
    const matchesCategory = selectedCategory === "ALL" || article.category === selectedCategory;
    const matchesSearch = article.headline.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  return (
    <div className="min-h-screen flex flex-col relative w-full selection:bg-sky-500/30 selection:text-sky-800 dark:selection:text-sky-300">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-sky-200/50 dark:bg-sky-900/15 rounded-full blur-[140px]" />
         <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-200/50 dark:bg-indigo-900/15 rounded-full blur-[140px]" />
      </div>

      <Navigation />

      <main className="flex-1 relative z-10 w-full pt-40 pb-32 px-4 sm:px-8 max-w-[1200px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center w-full"
        >
          <h1 className="text-3xl md:text-5xl font-sans font-bold text-slate-800 dark:text-white tracking-wide mb-4">
            {archiveData.site.name.toUpperCase()}
          </h1>
          <p className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {archiveData._description}
          </p>
        </motion.div>

        {/* Filter Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-4 mb-12 items-center justify-between"
        >
          <div className="flex gap-2 flex-wrap justify-center bg-white/60 dark:bg-[#0b0e14]/80 backdrop-blur-md p-2 rounded-xl border border-slate-200 dark:border-slate-800 w-full lg:w-auto">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-2 rounded-lg text-xs font-mono tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === "ALL" 
                  ? "bg-slate-800 dark:bg-sky-600 text-white shadow-md" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }`}
            >
              ALL MODULES
            </button>
            {archiveData.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-lg text-xs font-mono tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat.name 
                    ? "bg-slate-800 dark:bg-sky-600 text-white shadow-md" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-80 relative group">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>
             <input 
               type="text" 
               placeholder="QUERY DATABASE..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white/60 dark:bg-[#0b0e14]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 dark:text-white transition-colors"
             />
          </div>
        </motion.div>

        {/* Articles Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
          <AnimatePresence>
            {filteredArticles.map((article, idx) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.4, delay: (idx % 10) * 0.05 }}
                className="group relative bg-white/60 dark:bg-[#0b0e14]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all flex flex-col"
              >
                {/* Accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col h-full gap-5">
                  <div className="flex justify-between items-start">
                     <div>
                       <span className="text-3xl font-sans font-bold text-slate-800 dark:text-slate-100">{new Date(article.published_at).getFullYear()}</span>
                       <span className="block text-slate-500 dark:text-slate-400 text-xs font-mono tracking-widest mt-1">{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric'})}</span>
                     </div>
                     <div className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 uppercase">
                       {article.category}
                     </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-start">
                    <h2 className="text-xl md:text-2xl font-sans font-bold text-slate-800 dark:text-white mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {article.headline}
                    </h2>
                    {article.subheadline && (
                      <h3 className="text-xs md:text-sm font-mono text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                        {article.subheadline}
                      </h3>
                    )}
                    
                    <div className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-sm md:text-base border-l-2 border-slate-200 dark:border-slate-700 pl-4 py-1 mt-auto line-clamp-4">
                      {article.body}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 items-center">
                     {article.tags.map(tag => (
                       <span key={tag} className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded cursor-pointer hover:text-sky-500 transition-colors">
                         #{tag}
                       </span>
                     ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
          
          {filteredArticles.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/40 dark:bg-[#0b0e14]/40 border border-slate-200 border-dashed dark:border-slate-800 rounded-2xl"
            >
               <svg className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
               <span className="text-slate-500 font-mono text-xs tracking-widest uppercase">
                  NO RECORDS FOUND IN ENCLAVE
               </span>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}