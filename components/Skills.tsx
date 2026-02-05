import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { Skill } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await dbService.getSkills();
      setSkills(data);
    };
    load();
    const unsubscribe = dbService.subscribe(load);
    return () => unsubscribe();
  }, []);

  const chartData = skills.map(s => ({ name: s.name, level: s.level }));

  return (
    <section id="skills" className="py-32 bg-slate-50/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-600 font-black text-xs uppercase tracking-[0.5em] mb-4 block"
          >
            Capabilities
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-slate-900 tracking-tighter"
          >
            Core Expertise
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="h-[450px] w-full bg-white p-10 rounded-[4rem] shadow-2xl shadow-blue-500/5 border border-slate-100"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Radar
                  name="Proficiency"
                  dataKey="level"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  strokeWidth={3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((skill, idx) => (
              <motion.div 
                key={skill.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl group"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-slate-900 uppercase tracking-widest text-xs">{skill.name}</span>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;