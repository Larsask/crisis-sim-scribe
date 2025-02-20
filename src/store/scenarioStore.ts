
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
  addDecision: (decision: string, impact: 'low' | 'medium' | 'high') => void;
  updateTimeRemaining: (time: number) => void;
  getScenarioResults: () => {
    totalScore: number;
    decisions: Decision[];
    timeSpent: number;
  };
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
  addDecision: (decision, impact) => {
    const scoreMap = {
      'low': 5,
      'medium': 10,
      'high': 15
    };
    
    const consequenceMap = {
      'low': 'Minimal impact on operations, situation continues to develop.',
      'medium': 'Moderate disruption to operations, stakeholders are concerned.',
      'high': 'Significant impact on operations, immediate attention required.'
    };
    
    set((state) => ({
      decisions: [...state.decisions, {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        decision,
        impact,
        consequence: consequenceMap[impact],
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
  }
}));
