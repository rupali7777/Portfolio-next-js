import { ContactSubmission, Project, Experience, CVData, Skill, PortfolioMetadata } from '../types';
import { PROJECTS as SEED_PROJECTS, SKILLS as SEED_SKILLS, PORTFOLIO_OWNER as SEED_META } from '../constants';

const STORAGE_KEYS = {
  PROJECTS: 'portfolio_json_projects',
  MESSAGES: 'portfolio_json_messages',
  EXPERIENCES: 'portfolio_json_experiences',
  SKILLS: 'portfolio_json_skills',
  META: 'portfolio_json_meta',
  CV: 'portfolio_json_cv',
  INITIALIZED: 'portfolio_is_seeded_v4'
};

const DB_UPDATE_EVENT = 'portfolio-db-update';

class DbService {
  private async getFromStorage<T>(key: string): Promise<T[]> {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
    this.notify();
  }

  private notify() {
    window.dispatchEvent(new Event(DB_UPDATE_EVENT));
  }

  public subscribe(callback: () => void): () => void {
    window.addEventListener(DB_UPDATE_EVENT, callback);
    return () => window.removeEventListener(DB_UPDATE_EVENT, callback);
  }

  async init(): Promise<void> {
    const isSeeded = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isSeeded) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
      localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(SEED_SKILLS.map((s, i) => ({ ...s, id: i + 1 }))));
      localStorage.setItem(STORAGE_KEYS.META, JSON.stringify({ ...SEED_META, heroImageUrl: 'https://picsum.photos/400/400?random=10' }));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      this.notify();
    }
  }

  // Metadata
  async getMetadata(): Promise<PortfolioMetadata> {
    const data = localStorage.getItem(STORAGE_KEYS.META);
    return data ? JSON.parse(data) : { ...SEED_META, heroImageUrl: '' };
  }

  async updateMetadata(meta: PortfolioMetadata) {
    localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(meta));
    this.notify();
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return this.getFromStorage<Skill>(STORAGE_KEYS.SKILLS);
  }

  async addSkill(s: Omit<Skill, 'id'>) {
    const skills = await this.getFromStorage<Skill>(STORAGE_KEYS.SKILLS);
    skills.push({ ...s, id: Date.now() });
    this.saveToStorage(STORAGE_KEYS.SKILLS, skills);
  }

  async updateSkill(s: Skill) {
    const skills = await this.getFromStorage<Skill>(STORAGE_KEYS.SKILLS);
    const index = skills.findIndex(item => item.id === s.id);
    if (index !== -1) {
      skills[index] = s;
      this.saveToStorage(STORAGE_KEYS.SKILLS, skills);
    }
  }

  async deleteSkill(id: number) {
    const skills = await this.getFromStorage<Skill>(STORAGE_KEYS.SKILLS);
    this.saveToStorage(STORAGE_KEYS.SKILLS, skills.filter(s => s.id !== id));
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    return this.getFromStorage<Experience>(STORAGE_KEYS.EXPERIENCES);
  }

  async addExperience(e: Omit<Experience, 'id'>) {
    const experiences = await this.getFromStorage<Experience>(STORAGE_KEYS.EXPERIENCES);
    experiences.unshift({ ...e, id: Date.now() });
    this.saveToStorage(STORAGE_KEYS.EXPERIENCES, experiences);
  }

  async updateExperience(e: Experience) {
    const experiences = await this.getFromStorage<Experience>(STORAGE_KEYS.EXPERIENCES);
    const index = experiences.findIndex(item => item.id === e.id);
    if (index !== -1) {
      experiences[index] = e;
      this.saveToStorage(STORAGE_KEYS.EXPERIENCES, experiences);
    }
  }

  async deleteExperience(id: number) {
    const experiences = await this.getFromStorage<Experience>(STORAGE_KEYS.EXPERIENCES);
    this.saveToStorage(STORAGE_KEYS.EXPERIENCES, experiences.filter(e => e.id !== id));
  }

  // Messages
  async addMessage(msg: Omit<ContactSubmission, 'id' | 'timestamp'>) {
    const messages = await this.getFromStorage<ContactSubmission>(STORAGE_KEYS.MESSAGES);
    const newMsg: ContactSubmission = {
      ...msg,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    messages.unshift(newMsg);
    this.saveToStorage(STORAGE_KEYS.MESSAGES, messages);
  }

  async getMessages(): Promise<ContactSubmission[]> {
    return this.getFromStorage<ContactSubmission>(STORAGE_KEYS.MESSAGES);
  }

  async deleteMessage(id: number) {
    const messages = await this.getFromStorage<ContactSubmission>(STORAGE_KEYS.MESSAGES);
    this.saveToStorage(STORAGE_KEYS.MESSAGES, messages.filter(m => m.id !== id));
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.getFromStorage<Project>(STORAGE_KEYS.PROJECTS);
  }

  async addProject(p: Omit<Project, 'id'>) {
    const projects = await this.getFromStorage<Project>(STORAGE_KEYS.PROJECTS);
    projects.unshift({ ...p, id: Date.now() });
    this.saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  }

  async updateProject(p: Project) {
    const projects = await this.getFromStorage<Project>(STORAGE_KEYS.PROJECTS);
    const index = projects.findIndex(proj => proj.id === p.id);
    if (index !== -1) {
      projects[index] = p;
      this.saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    }
  }

  async deleteProject(id: number) {
    const projects = await this.getFromStorage<Project>(STORAGE_KEYS.PROJECTS);
    this.saveToStorage(STORAGE_KEYS.PROJECTS, projects.filter(p => p.id !== id));
  }

  // CV
  async saveCV(cv: CVData) {
    localStorage.setItem(STORAGE_KEYS.CV, JSON.stringify(cv));
    this.notify();
  }

  async getCV(): Promise<CVData | null> {
    const data = localStorage.getItem(STORAGE_KEYS.CV);
    return data ? JSON.parse(data) : null;
  }
}

export const dbService = new DbService();