
import { Project, Skill } from './types';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "EcoTrack AI",
    description: "A sustainability monitoring dashboard that uses Gemini to analyze energy consumption patterns.",
    longDescription: "EcoTrack AI is a comprehensive solution for industrial energy monitoring. It integrates real-time sensor data with the Gemini API to provide predictive maintenance alerts and optimize power usage based on historical patterns. The dashboard features high-performance visualizations and an automated reporting system.",
    tags: ["React", "Gemini API", "AI"],
    techStack: ["React 19", "TypeScript", "Tailwind CSS", "Gemini Pro", "Recharts", "Node.js"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    link: "https://example.com/demo",
    githubUrl: "https://github.com/alexrivera/ecotrack"
  },
  {
    id: 2,
    title: "Nexus Commerce",
    description: "Full-stack e-commerce solution with dynamic inventory management and personalized recommendations.",
    longDescription: "Nexus Commerce is a next-generation retail platform. It features a custom-built recommendation engine powered by machine learning, a high-concurrency inventory system, and a sleek, mobile-first design. The platform handles thousands of transactions per minute while maintaining sub-second load times.",
    tags: ["Next.js", "TypeScript", "Fullstack"],
    techStack: ["Next.js 15", "TypeScript", "MongoDB", "Redux Toolkit", "Stripe API", "AWS Lambda"],
    imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800",
    link: "https://example.com/demo",
    githubUrl: "https://github.com/alexrivera/nexus"
  },
  {
    id: 3,
    title: "Visionary UI",
    description: "An open-source design system focused on accessibility and motion-first interfaces.",
    longDescription: "Visionary UI is a community-driven design system that prioritizes WCAG 2.1 compliance and fluid animations. It includes over 50 accessible components, a custom CLI for theme generation, and deep integration with Framer Motion for high-fidelity interactive prototypes.",
    tags: ["React", "Design", "Frontend"],
    techStack: ["React", "Framer Motion", "Storybook", "PostCSS", "Aria Kit"],
    imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800",
    link: "https://example.com/demo",
    githubUrl: "https://github.com/alexrivera/visionary"
  },
  {
    id: 4,
    title: "Neural Scribe",
    description: "AI-powered technical writing assistant that generates documentation from source code comments.",
    longDescription: "Neural Scribe utilizes large language models to bridge the gap between code and documentation. It analyzes project structures and extracts meaningful context to generate professional-grade wikis and API references automatically, saving developers hours of manual writing.",
    tags: ["AI", "TypeScript", "Tooling"],
    techStack: ["TypeScript", "Gemini Flash", "AST Parser", "Markdown-it", "Vercel AI SDK"],
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    link: "https://example.com/demo",
    githubUrl: "https://github.com/alexrivera/scribe"
  }
];

export const SKILLS: Skill[] = [
  // Fixed: Added missing id property to each skill to comply with the Skill interface definition
  { id: 1, name: "React/Next.js", level: 95, category: 'Frontend' },
  { id: 2, name: "TypeScript", level: 90, category: 'Frontend' },
  { id: 3, name: "Node.js", level: 85, category: 'Backend' },
  { id: 4, name: "Gemini SDK", level: 80, category: 'AI' },
  { id: 5, name: "Tailwind CSS", level: 98, category: 'Frontend' },
  { id: 6, name: "PostgreSQL", level: 75, category: 'Backend' },
  { id: 7, name: "AWS/Vercel", level: 80, category: 'Tools' },
  { id: 8, name: "Docker", level: 70, category: 'Tools' }
];

export const PORTFOLIO_OWNER = {
  name: "Alex Rivera",
  role: "Senior Full-Stack Engineer & AI Specialist",
  location: "San Francisco, CA",
  email: "alex.rivera@example.com",
  github: "https://github.com/alexrivera",
  linkedin: "https://linkedin.com/in/alexrivera",
  baseBio: "I am a passionate developer building the next generation of web applications with a focus on AI integration and exceptional user experiences."
};
