
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

interface ScenarioState {
  category: ScenarioCategory | null;
  scenarioId: string | null;
  complexity: Complexity | null;
  duration: Duration | null;
  isExerciseActive: boolean;
  timeRemaining: number;
  decisions: Array<{
    id: string;
    timestamp: number;
    decision: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  setCategory: (category: ScenarioCategory) => void;
  setScenario: (id: string) => void;
  setComplexity: (complexity: Complexity) => void;
  setDuration: (duration: Duration) => void;
  startExercise: () => void;
  endExercise: () => void;
  addDecision: (decision: string, impact: 'low' | 'medium' | 'high') => void;
  updateTimeRemaining: (time: number) => void;
}

export const useScenarioStore = create<ScenarioState>((set) => ({
  category: null,
  scenarioId: null,
  complexity: null,
  duration: null,
  isExerciseActive: false,
  timeRemaining: 0,
  decisions: [],
  setCategory: (category) => set({ category }),
  setScenario: (id) => set({ scenarioId: id }),
  setComplexity: (complexity) => set({ complexity }),
  setDuration: (duration) => set({ duration }),
  startExercise: () => set({ isExerciseActive: true }),
  endExercise: () => set({ isExerciseActive: false }),
  addDecision: (decision, impact) => 
    set((state) => ({
      decisions: [...state.decisions, {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        decision,
        impact
      }]
    })),
  updateTimeRemaining: (time) => set({ timeRemaining: time }),
}));
