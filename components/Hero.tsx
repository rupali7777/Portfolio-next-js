import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { PortfolioMetadata } from '../types';

const Hero: React.FC = () => {
  const [meta, setMeta] = useState<PortfolioMetadata | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await dbService.getMetadata();
      setMeta(data);
    };
    load();
    const unsubscribe = dbService.subscribe(load);
    return () => unsubscribe();
  }, []);

  if (!meta) return null;

  return (
    <section id="about" className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-slate-50">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center md:space-x-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12 md:mb-0 relative"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl relative">
              <img src={meta.heroImageUrl} alt={meta.name} className="w-full h-full object-cover" />
            </div>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 glass-effect w-16 h-16 rounded-3xl shadow-2xl border border-white/50 flex items-center justify-center text-2xl"
            >
              🚀
            </motion.div>
          </motion.div>
          
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">PROFESSIONAL PORTFOLIO</span>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 leading-[0.9] tracking-tighter">
                {meta.name.split(' ')[0]} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                  {meta.name.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 mb-10 font-medium leading-relaxed max-w-2xl">
                {meta.role} building <span className="text-slate-900 font-bold underline decoration-blue-500/30 decoration-8 underline-offset-4">scalable</span> digital experiences.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-10 rounded-[3rem] mb-10 shadow-2xl shadow-slate-200/50 border border-slate-100"
            >
              <p className="text-slate-700 leading-relaxed font-semibold text-xl text-center md:text-left italic">
                "{meta.baseBio}"
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;