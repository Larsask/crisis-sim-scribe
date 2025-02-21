
import { createContext, useContext } from 'react';
import { CrisisEvent, StakeholderMessage, DecisionOption } from '@/types/crisis';
import { TimeBasedEvent, AIResponse, FollowUpMessage } from '@/types/crisis-enhanced';

interface ExerciseContextType {
  events: CrisisEvent[];
  messages: StakeholderMessage[];
  currentStepId: string;
  isTimeSkipping: boolean;
  availableOptions: DecisionOption[];
  timeBasedEvents: TimeBasedEvent[];
  followUpMessage: FollowUpMessage | null;
  aiResponse: AIResponse | null;
  onDecision: (text: string, isCustom: boolean) => void;
  onTimeSkip: () => void;
  onFollowUpResponse: (response: string) => void;
}

export const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export const useExerciseContext = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExerciseContext must be used within an ExerciseProvider');
  }
  return context;
};
