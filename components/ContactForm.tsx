import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../services/dbService';
import { CVData } from '../types';

const SUBJECTS = [
  "Project Inquiry",
  "Job Opportunity",
  "AI Collaboration",
  "Speaking Engagement",
  "General Networking",
  "Other"
];

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Project Inquiry', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [cv, setCv] = useState<CVData | null>(null);

  useEffect(() => {
    dbService.getCV().then(setCv);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await dbService.addMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: 'Project Inquiry', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleDownloadCV = () => {
    if (!cv) return;
    const link = document.createElement('a');
    link.href = cv.base64;
    link.download = cv.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h3>
            <p className="text-slate-500 mb-8">Thanks for reaching out. I'll get back to you shortly.</p>
            
            {cv && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={handleDownloadCV}
                className="inline-flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>Download My Full CV</span>
              </motion.button>
            )}
            
            <button 
              onClick={() => setStatus('idle')}
              className="block w-full mt-6 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all bg-slate-50 font-medium"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all bg-slate-50 font-medium"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject of interest</label>
              <div className="relative">
                <select
                  required
                  className="w-full appearance-none px-5 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all bg-slate-50 font-medium cursor-pointer"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Detailed Message</label>
              <textarea
                required
                rows={4}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all bg-slate-50 font-medium resize-none"
                placeholder="Briefly describe your requirements..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 shadow-xl shadow-slate-900/10 disabled:opacity-50"
            >
              {status === 'submitting' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Transmitting...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>
            
            {status === 'error' && (
              <p className="text-red-500 text-center text-xs font-bold bg-red-50 py-3 rounded-xl">Connection failed. Please retry.</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContactForm;