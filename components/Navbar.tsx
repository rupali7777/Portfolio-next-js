import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-effect py-4 shadow-sm' : 'bg-transparent py-6 md:py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-2xl font-black tracking-tighter text-slate-900 italic relative z-50">
            PORTFOLIO.
          </a>
          
          <div className="hidden md:flex space-x-10">
            {navLinks.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2.5 text-slate-900 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-slate-100 z-50 active:scale-95 transition-transform"
            aria-label="Open Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] md:hidden cursor-pointer"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[101] shadow-2xl p-8 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-16">
                <span className="text-xl font-black italic text-slate-900">MENU</span>
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors active:scale-95"
                  aria-label="Close Menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col space-y-6">
                {navLinks.map((item) => (
                  <a 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-3xl font-black text-slate-900 hover:text-blue-600 transition-colors tracking-tighter"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <div className="mt-auto">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Let's Connect</p>
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">⚡</div>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">✉️</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;