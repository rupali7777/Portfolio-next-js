import React, { useState, useMemo, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Project } from '../types';
import ProjectDetail from './ProjectDetail';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await dbService.getProjects();
      setProjects(data);
      setLoading(false);
    };
    load();
    
    // Subscribe to DB updates instead of polling
    const unsubscribe = dbService.subscribe(load);
    return () => unsubscribe();
  }, []);

  const tags = useMemo(() => {
    const allTags = projects.flatMap(p => p.tags);
    return ['All', ...Array.from(new Set(allTags))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedTag === 'All') return projects;
    return projects.filter(p => p.tags.includes(selectedTag));
  }, [selectedTag, projects]);

  if (loading && projects.length === 0) {
    return (
      <section id="projects" className="py-20 bg-slate-100/50">
        <div className="container mx-auto px-6 text-center">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-slate-100/50 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-slate-600 text-lg">A selection of my recent work focusing on scalable architecture and design engineering.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedTag === tag 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => setSelectedProject(project)}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 cursor-pointer flex flex-col animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <div className="text-white">
                    <p className="font-bold text-lg mb-1">View Details</p>
                    <p className="text-sm text-slate-200">Click to expand</p>
                  </div>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">{project.description}</p>
                
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                  Read Case Study
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-xl italic">No projects found for this category.</p>
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectDetail 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
};

export default Projects;