
import { createContext, useContext } from 'react';
import { CrisisEvent, StakeholderMessage, DecisionOption, ScenarioBrief } from '@/types/crisis';
import { TimeBasedEvent, AIResponse, FollowUpMessage, ExerciseConfig } from '@/types/crisis-enhanced';

interface ExerciseContextType {
  events: CrisisEvent[];
  messages: StakeholderMessage[];
  currentStepId: string;
  isTimeSkipping: boolean;
  availableOptions: DecisionOption[];
  timeBasedEvents: TimeBasedEvent[];
  followUpMessage: FollowUpMessage | null;
  aiResponse: AIResponse | null;
  timeRemaining: number;
  scenarioBrief: ScenarioBrief;
  showJournalistCall: boolean;
  config: ExerciseConfig;
  setConfig: (config: ExerciseConfig) => void;
  onDecision: (text: string, isCustom: boolean) => void;
  onTimeSkip: () => void;
  onFollowUpResponse: (response: string) => void;
  onStakeholderResponse: (messageId: string, response: string) => void;
  onMessageDismiss: (messageId: string) => void;
  onJournalistResponse: (response: string) => void;
  setShowJournalistCall: (show: boolean) => void;
}

export const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export const useExerciseContext = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExerciseContext must be used within an ExerciseProvider');
  }
  return context;
};
