import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface ProfileState {
  githubUsername: string;
  name: string;
  title: string;
  bio: string;
  portfolio: string;
  linkedin: string;
  email: string;
  avatarUrl: string;
}

interface HeaderState {
  enabled: boolean;
  gradientStart: string;
  gradientEnd: string;
  fontColor: string;
  fontSize: string;
  height: string;
  animation: string;
}

interface Project {
  name: string;
  url: string;
  description: string;
  technologies: string;
  icon: string;
  selected: boolean;
  order: number;
}

interface TechStackState {
  enabled: boolean;
  technologies: string[];
  highlightCategory: string;
}

interface GithubActivityState {
  enabled: boolean;
  showStreak: boolean;
  theme: string;
}

interface BeyondCodeState {
  enabled: boolean;
  items: string[];
  quote: string;
}

interface AppState {
  currentStep: Step;
  profile: ProfileState;
  header: HeaderState;
  projects: Project[];
  fetchedRepos: Project[]; // Added to store all repos fetched from GitHub
  techStack: TechStackState;
  githubActivity: GithubActivityState;
  beyondCode: BeyondCodeState;
  
  // Actions
  setCurrentStep: (step: Step) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (data: Partial<ProfileState>) => void;
  updateHeader: (data: Partial<HeaderState>) => void;
  updateTechStack: (data: Partial<TechStackState>) => void;
  updateGithubActivity: (data: Partial<GithubActivityState>) => void;
  updateBeyondCode: (data: Partial<BeyondCodeState>) => void;
  setProjects: (projects: Project[]) => void;
  setFetchedRepos: (repos: Project[]) => void;
  resetStore: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentStep: 1,
      profile: {
        githubUsername: '',
        name: '',
        title: '',
        bio: '',
        portfolio: '',
        linkedin: '',
        email: '',
        avatarUrl: '',
      },
      header: {
        enabled: true,
        gradientStart: 'f4a261',
        gradientEnd: 'e76f51',
        fontColor: 'ffffff',
        fontSize: '40',
        height: '180',
        animation: 'waving',
      },
      projects: [],
      fetchedRepos: [],
      techStack: {
        enabled: true,
        technologies: [],
        highlightCategory: '',
      },
      githubActivity: {
        enabled: true,
        showStreak: true,
        theme: 'transparent',
      },
      beyondCode: {
        enabled: true,
        items: [],
        quote: ''
      },
      
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 7) as Step })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as Step })),
      updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
      updateHeader: (data) => set((state) => ({ header: { ...state.header, ...data } })),
      updateTechStack: (data) => set((state) => ({ techStack: { ...state.techStack, ...data } })),
      updateGithubActivity: (data) => set((state) => ({ githubActivity: { ...state.githubActivity, ...data } })),
      updateBeyondCode: (data) => set((state) => ({ beyondCode: { ...state.beyondCode, ...data } })),
      setProjects: (projects) => set({ projects }),
      setFetchedRepos: (fetchedRepos) => set({ fetchedRepos }),
      resetStore: () => set({
        currentStep: 1,
        profile: { githubUsername: '', name: '', title: '', bio: '', portfolio: '', linkedin: '', email: '', avatarUrl: '' },
        header: { enabled: true, gradientStart: 'f4a261', gradientEnd: 'e76f51', fontColor: 'ffffff', fontSize: '40', height: '180', animation: 'waving' },
        projects: [],
        fetchedRepos: [],
        techStack: { enabled: true, technologies: [], highlightCategory: '' },
        githubActivity: { enabled: true, showStreak: true, theme: 'transparent' },
        beyondCode: { enabled: true, items: [], quote: '' },
      }),
    }),
    {
      name: 'readme-studio-storage',
      version: 2,
    }
  )
);
