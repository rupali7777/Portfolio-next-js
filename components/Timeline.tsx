import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { Experience } from '../types';

const Timeline: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await dbService.getExperiences();
      setExperiences(data.sort((a, b) => b.id - a.id));
    };
    load();
    const unsubscribe = dbService.subscribe(load);
    return () => unsubscribe();
  }, []);

  return (
    <section id="experience" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Work Journey
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500"
          >
            My professional career path and key milestones.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 md:-ml-0.5 w-1 h-full bg-slate-100 rounded-full"></div>

          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center justify-between w-full ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="hidden md:block w-5/12"></div>
                
                {/* Center Dot */}
                <div className="absolute left-0 md:left-1/2 md:-ml-4 w-8 h-8 rounded-full border-4 border-white bg-blue-600 shadow-xl z-10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>

                <div className="ml-10 md:ml-0 md:w-5/12 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{exp.company}</h3>
                      <p className="text-blue-600 font-bold text-sm tracking-wide uppercase">{exp.role}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-100 rounded-full text-slate-400">
                      {exp.dateRange}
                    </span>
                  </div>
                  
                  {exp.projectName && (
                    <div className="mb-3 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg inline-block">
                      Project: {exp.projectName}
                    </div>
                  )}
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{exp.details}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map(tech => (
                      <span key={tech} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;