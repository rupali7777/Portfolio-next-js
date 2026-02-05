import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="fixed inset-0 z-[150] bg-white overflow-y-auto hide-scrollbar"
    >
      <div className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center">
          <button 
            onClick={onClose}
            className="group flex items-center space-x-3 text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] hover:text-blue-600 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </div>
            <span>Back to Deck</span>
          </button>
          
          <div className="flex space-x-4">
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20">Live Demo</a>
            )}
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-6 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Header Content */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100/50">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-6xl md:text-9xl font-black text-slate-900 mb-10 tracking-tighter leading-[0.85]">
                  {project.title.split(' ').map((word, i) => (
                    <span key={i} className={i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                
                <div className="prose prose-slate max-w-none text-xl text-slate-500 leading-relaxed font-medium mb-12">
                  {project.longDescription}
                </div>

                <div className="space-y-12">
                  <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center">
                       <span className="w-8 h-[2px] bg-blue-600 mr-3"></span>
                       Technical Stack
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {project.techStack.map(tech => (
                        <span key={tech} className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {project.githubUrl && (
                    <div className="flex items-center space-x-6 p-6 border-2 border-slate-100 rounded-[2.5rem] hover:border-blue-200 transition-all group">
                      <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Repository</p>
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-xl font-black text-slate-900 hover:text-blue-600 transition-colors">Explore Source Code</a>
                      </div>
                      <svg className="w-6 h-6 text-slate-300 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-blue-600/5 rounded-[4rem] blur-2xl"></div>
                <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white group">
                  <img src={project.imageUrl} alt={project.title} className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                {/* Floating Metric Card */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 min-w-[200px]"
                >
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center text-xl">📈</div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Impact Factor</p>
                        <p className="text-lg font-black text-slate-900">High Conversion</p>
                      </div>
                   </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Footer Navigation */}
        <footer className="mt-auto py-20 px-6 border-t border-slate-100 bg-slate-50/50">
          <div className="container mx-auto max-w-6xl text-center">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em] mb-6">READY TO COLLABORATE?</p>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 tracking-tighter">Let's build something <span className="text-blue-600">remarkable</span>.</h2>
            <button 
              onClick={onClose}
              className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
            >
              Start Your Inquiry
            </button>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;