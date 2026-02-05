import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Timeline from './components/Timeline';
import ContactForm from './components/ContactForm';
import AdminDashboard from './components/AdminDashboard';
import { PORTFOLIO_OWNER } from './constants';
import { dbService } from './services/dbService';

const App: React.FC = () => {
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const init = async () => {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 20);

      await dbService.init();
      setTimeout(() => setReady(true), 600);
    };
    init();

    const authed = localStorage.getItem('portfolio_is_admin') === 'true';
    if (authed) setIsAdminVisible(false);
  }, []);

  const handleAdminAccess = () => {
    localStorage.setItem('portfolio_is_admin', 'true');
    setIsAdminVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_is_admin');
    setIsAdminVisible(false);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent"></div>
        <div className="relative z-10 w-full max-w-xs px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h1 className="text-4xl font-black mb-2 tracking-tighter italic">PORTFOLIO.</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] mb-12">Loading Experience</p>
            
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-slate-50"
    >
      <Navbar />
      
      <main>
        <Hero />
        
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
        >
          <Projects />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
        >
          <Timeline />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
        >
          <Skills />
        </motion.div>
        
        <section id="contact" className="py-32 px-6 bg-white border-t border-slate-100">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">GET IN TOUCH</span>
                <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[1] tracking-tighter text-slate-900">
                  Let's build <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">remarkable</span> things.
                </h2>
                <p className="text-slate-500 text-lg md:text-xl mb-12 leading-relaxed max-w-md font-medium">
                  Have a vision for a project or just want to connect? My inbox is always open.
                </p>
                <div className="space-y-8">
                  <div className="flex items-center space-x-6 group">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">✉️</div>
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Email</p>
                      <a href={`mailto:${PORTFOLIO_OWNER.email}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">alex.rivera@example.com</a>
                    </div>
                  </div>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-slate-100 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">PORTFOLIO.</h3>
            <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.4em] font-black">© {new Date().getFullYear()} Alex Rivera</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10 items-center text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
            <a href={PORTFOLIO_OWNER.github} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">GitHub</a>
            <a href={PORTFOLIO_OWNER.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">LinkedIn</a>
            <button 
              onClick={handleAdminAccess}
              className="px-6 py-3 rounded-2xl border-2 border-slate-50 hover:border-blue-100 hover:text-blue-400 transition-all bg-white"
            >
              Control Panel
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isAdminVisible && (
          <AdminDashboard 
            onClose={() => setIsAdminVisible(false)} 
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default App;