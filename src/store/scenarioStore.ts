
import { create } from 'zustand';

export type ScenarioCategory = 
  | 'cyberattack'
  | 'misinformation'
  | 'insider-threat'
  | 'reputation'
  | 'hybrid'
  | 'ai-powered'
  | 'real-time';

export type Complexity = 'simple' | 'moderate' | 'advanced';

export type Duration = '30min' | '1hr' | '2hrs';

interface Decision {
  id: string;
  timestamp: number;
  decision: string;
  impact: 'low' | 'medium' | 'high';
  consequence?: string;
  score: number;
  followUpResponse?: string;
}

interface ScenarioState {
  category: ScenarioCategory | null;
  scenarioId: string | null;
  complexity: Complexity | null;
  duration: Duration | null;
  isExerciseActive: boolean;
  timeRemaining: number;
  totalScore: number;
  decisions: Decision[];
  setCategory: (category: ScenarioCategory) => void;
  setScenario: (id: string) => void;
  setComplexity: (complexity: Complexity) => void;
  setDuration: (duration: Duration) => void;
  startExercise: () => void;
  endExercise: () => void;
  addDecision: (decision: string, impact: 'low' | 'medium' | 'high', consequence: string, followUpResponse?: string) => void;
  updateTimeRemaining: (time: number) => void;
  getScenarioResults: () => {
    totalScore: number;
    decisions: Decision[];
    timeSpent: number;
  };
  currentTime: number;
  isFastForwarding: boolean;
  fastForward: () => void;
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  category: null,
  scenarioId: null,
  complexity: null,
  duration: null,
  isExerciseActive: false,
  timeRemaining: 0,
  totalScore: 0,
  decisions: [],
  setCategory: (category) => set({ category }),
  setScenario: (id) => set({ scenarioId: id }),
  setComplexity: (complexity) => set({ complexity }),
  setDuration: (duration) => set({ duration }),
  startExercise: () => set({ isExerciseActive: true, totalScore: 0, decisions: [] }),
  endExercise: () => set({ isExerciseActive: false }),
  addDecision: (decision, impact, consequence, followUpResponse) => {
    const scoreMap = {
      'low': 5,
      'medium': 10,
      'high': 15
    };
    
    set((state) => ({
      decisions: [...state.decisions, {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        decision,
        impact,
        consequence,
        followUpResponse,
        score: scoreMap[impact]
      }],
      totalScore: state.totalScore + scoreMap[impact]
    }));
  },
  updateTimeRemaining: (time) => set({ timeRemaining: time }),
  getScenarioResults: () => {
    const state = get();
    const originalDuration = {
      '30min': 30 * 60 * 1000,
      '1hr': 60 * 60 * 1000,
      '2hrs': 2 * 60 * 60 * 1000
    }[state.duration!];
    
    return {
      totalScore: state.totalScore,
      decisions: state.decisions,
      timeSpent: originalDuration! - state.timeRemaining
    };
  },
  currentTime: Date.now(),
  isFastForwarding: false,
  fastForward: () => {
    set((state) => ({
      isFastForwarding: true,
      currentTime: state.currentTime + 300000, // Fast forward 5 minutes
      timeRemaining: Math.max(0, state.timeRemaining - 300000) // Decrease remaining time by 5 minutes
    }));
    
    setTimeout(() => {
      set({ isFastForwarding: false });
    }, 1000);
  }
}));
