import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { ContactSubmission, Project, Experience, CVData, Skill, PortfolioMetadata } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
  onLogout: () => void;
}

const ROLES = ['Software Engineer', 'Product Manager', 'Designer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer'] as const;

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'messages' | 'experiences' | 'cv' | 'skills' | 'profile'>('projects');
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [meta, setMeta] = useState<PortfolioMetadata | null>(null);
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingExperience, setEditingExperience] = useState<Partial<Experience> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [msgs, projs, exps, cv, sks, mt] = await Promise.all([
        dbService.getMessages(),
        dbService.getProjects(),
        dbService.getExperiences(),
        dbService.getCV(),
        dbService.getSkills(),
        dbService.getMetadata()
      ]);
      setMessages(msgs);
      setProjects(projs);
      setExperiences(exps);
      setCurrentCV(cv);
      setSkills(sks);
      setMeta(mt);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (meta) {
      await dbService.updateMetadata(meta);
      alert('Profile updated!');
    }
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const cv: CVData = { name: file.name, base64: reader.result as string, type: file.type };
      await dbService.saveCV(cv);
      setCurrentCV(cv);
      alert('CV Uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    if (editingSkill.id) await dbService.updateSkill(editingSkill as Skill);
    else await dbService.addSkill(editingSkill as Omit<Skill, 'id'>);
    setEditingSkill(null);
    fetchData();
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (editingProject.id) await dbService.updateProject(editingProject as Project);
    else await dbService.addProject(editingProject as Omit<Project, 'id'>);
    setEditingProject(null);
    fetchData();
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;
    if (editingExperience.id) await dbService.updateExperience(editingExperience as Experience);
    else await dbService.addExperience(editingExperience as Omit<Experience, 'id'>);
    setEditingExperience(null);
    fetchData();
  };

  const menuItems = [
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'experiences', label: 'Timeline', icon: '⏳' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'cv', label: 'CV / Assets', icon: '📄' },
    { id: 'profile', label: 'Settings', icon: '⚙️' },
    { id: 'messages', label: `Inquiries (${messages.length})`, icon: '✉️' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center md:p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-7xl md:h-[90vh] h-full bg-white md:rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <h2 className="font-black text-slate-900 tracking-tighter">DASHBOARD</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-xl">✕</button>
        </div>

        {/* Sidebar */}
        <div className="md:w-72 w-full bg-slate-50 md:border-r border-slate-100 p-8 flex flex-col overflow-x-auto no-scrollbar">
          <h2 className="hidden md:block text-2xl font-black text-slate-900 mb-12 tracking-tighter italic">ADMIN.</h2>
          
          <nav className="flex md:flex-col flex-row gap-3 min-w-max md:min-w-0">
            {menuItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-4 whitespace-nowrap ${activeTab === item.id ? 'bg-white text-blue-600 shadow-xl shadow-blue-500/5 border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 hidden md:block">
            <button onClick={onLogout} className="w-full text-left px-6 py-4 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 rounded-2xl transition-colors tracking-widest">Sign Out</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-white p-8 md:p-16 hide-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full flex-col">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-6">
                <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{activeTab.toUpperCase()}</h3>
                  <p className="text-slate-400 font-medium">Control the digital experience.</p>
                </div>
                {['projects', 'experiences', 'skills'].includes(activeTab) && (
                  <button 
                    onClick={() => {
                      if (activeTab === 'projects') setEditingProject({ tags: [], techStack: [], imageUrl: '' });
                      if (activeTab === 'experiences') setEditingExperience({ technologies: [], role: 'Software Engineer' });
                      if (activeTab === 'skills') setEditingSkill({ level: 80, category: 'Frontend' });
                    }}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all"
                  >
                    + Create New
                  </button>
                )}
              </div>

              {activeTab === 'profile' && meta && (
                <form onSubmit={handleSaveMeta} className="max-w-4xl space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Name</label>
                      <input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold" value={meta.name} onChange={e => setMeta({...meta, name: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Headline</label>
                      <input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold" value={meta.role} onChange={e => setMeta({...meta, role: e.target.value})} />
                    </div>
                    
                    <div className="col-span-full space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Hero Image</label>
                      <div className="flex items-center space-x-6">
                        <img src={meta.heroImageUrl} className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg" />
                        <label className="flex-1 cursor-pointer">
                          <div className="w-full p-5 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-center text-slate-400 font-bold hover:border-blue-300 hover:bg-blue-50 transition-all">
                            Click to change image
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, (b) => setMeta({...meta, heroImageUrl: b}))} />
                        </label>
                      </div>
                    </div>

                    <div className="col-span-full space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Bio</label>
                      <textarea className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all h-40 resize-none font-medium leading-relaxed" value={meta.baseBio} onChange={e => setMeta({...meta, baseBio: e.target.value})} />
                    </div>
                  </div>
                  <button type="submit" className="px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-colors shadow-2xl shadow-slate-900/10">Save Settings</button>
                </form>
              )}

              {activeTab === 'projects' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {projects.map(p => (
                    <div key={p.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center space-x-8 group hover:shadow-xl transition-all">
                      <img src={p.imageUrl} className="w-28 h-28 rounded-3xl object-cover shadow-md border-4 border-white" alt="" />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-xl tracking-tight">{p.title}</h4>
                        <div className="flex space-x-4 mt-4">
                          <button onClick={() => setEditingProject(p)} className="text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">Edit</button>
                          <button onClick={async () => { if(confirm('Delete Project?')) { await dbService.deleteProject(p.id); fetchData(); } }} className="text-[10px] font-black uppercase text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'cv' && (
                <div className="max-w-3xl space-y-12">
                  <div className="p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl shadow-lg">📄</div>
                    <h4 className="text-2xl font-black mb-4 tracking-tight">CV Management</h4>
                    <p className="text-slate-400 font-medium mb-10 max-w-md mx-auto">This file is automatically provided to users who complete the contact form.</p>
                    
                    {currentCV ? (
                      <div className="mb-10 p-6 bg-white rounded-[2rem] border border-blue-50 flex items-center justify-between shadow-sm">
                        <div className="flex items-center space-x-4">
                          <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xs uppercase">PDF</span>
                          <span className="text-slate-700 font-bold truncate max-w-[250px]">{currentCV.name}</span>
                        </div>
                        <button onClick={async () => { localStorage.removeItem('portfolio_json_cv'); setCurrentCV(null); }} className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline">Remove</button>
                      </div>
                    ) : (
                      <label className="inline-block px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] cursor-pointer hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
                        Upload New CV
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleCVUpload} />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-6">
                  {messages.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No new inquiries</p>
                    </div>
                  ) : messages.map(m => (
                    <div key={m.id} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-blue-200 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-2xl font-black text-slate-900 tracking-tight">{m.name}</p>
                          <p className="text-sm text-blue-600 font-bold mt-1">{m.email}</p>
                        </div>
                        <button onClick={async () => { if(confirm('Delete Inquiry?')) { await dbService.deleteMessage(m.id!); fetchData(); } }} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 shadow-sm transition-all">✕</button>
                      </div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Topic: {m.subject}</p>
                      <div className="bg-white p-6 rounded-2xl text-slate-600 leading-relaxed font-medium shadow-sm italic">
                        "{m.message}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Item Editing Modal */}
      {(editingProject || editingExperience || editingSkill) && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => { setEditingProject(null); setEditingExperience(null); setEditingSkill(null); }}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 md:p-14 overflow-y-auto max-h-[90vh] shadow-2xl">
            {editingProject && (
              <form onSubmit={handleSaveProject} className="space-y-8">
                <h3 className="text-3xl font-black tracking-tighter italic">PROJECT.EDITOR</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Title</label>
                    <input required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none" value={editingProject.title || ''} onChange={e => setEditingProject({...editingProject, title: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Project Media</label>
                    <div className="flex items-center space-x-6">
                      {editingProject.imageUrl && <img src={editingProject.imageUrl} className="w-20 h-20 rounded-2xl object-cover" />}
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full p-4 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-center text-slate-400 font-bold hover:bg-blue-50 transition-all">
                          Upload image
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, (b) => setEditingProject({...editingProject, imageUrl: b}))} />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Brief Summary</label>
                    <textarea required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none h-24" value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Case Study</label>
                    <textarea required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none h-40" value={editingProject.longDescription || ''} onChange={e => setEditingProject({...editingProject, longDescription: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 shadow-2xl transition-all">Publish Project</button>
              </form>
            )}
            
            {editingSkill && (
              <form onSubmit={handleSaveSkill} className="space-y-8">
                <h3 className="text-3xl font-black tracking-tighter italic">SKILL.EDITOR</h3>
                <div className="space-y-6">
                  <input required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold" placeholder="Skill Name" value={editingSkill.name || ''} onChange={e => setEditingSkill({...editingSkill, name: e.target.value})} />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                      <span>Proficiency Level</span>
                      <span>{editingSkill.level}%</span>
                    </label>
                    <input type="range" min="0" max="100" className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" value={editingSkill.level || 0} onChange={e => setEditingSkill({...editingSkill, level: parseInt(e.target.value)})} />
                  </div>
                </div>
                <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all">Save Skill</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;