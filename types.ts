export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  techStack: string[];
  imageUrl: string;
  link: string;
  githubUrl?: string;
}

export interface Experience {
  id: number;
  company: string;
  role: 'Software Engineer' | 'Product Manager' | 'Designer' | 'Frontend Developer' | 'Backend Developer' | 'Full Stack Developer';
  dateRange: string;
  technologies: string[];
  projectName?: string;
  details?: string;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  category: 'Frontend' | 'Backend' | 'Tools' | 'AI';
}

export interface PortfolioMetadata {
  name: string;
  role: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  baseBio: string;
  heroImageUrl: string;
}

export type BioStyle = 'professional' | 'creative' | 'witty' | 'minimalist';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

export interface CVData {
  name: string;
  base64: string;
  type: string;
}