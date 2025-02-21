
import { useState, useEffect } from 'react';
import { ExerciseContext } from './ExerciseContext';
import { useScenarioStore } from '@/store/scenarioStore';
import { useEventManagement } from '@/hooks/useEventManagement';
import { useMessageManagement } from '@/hooks/useMessageManagement';
import { useJournalistCall } from '@/hooks/useJournalistCall';
import { aiService } from '@/services/ai-service';
import { crisisTimelineService } from '@/services/crisis-timeline';
import { useToast } from "@/components/ui/use-toast";
import { FollowUpMessage, ExerciseConfig } from '@/types/crisis-enhanced';
import { scenarios } from '@/data/scenarios';
import { useNavigate } from 'react-router-dom';
import { crisisMemoryManager } from '@/utils/crisis-memory';

export const ExerciseProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [isTimeSkipping, setIsTimeSkipping] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<DecisionOption[]>([]);
  const [followUpMessage, setFollowUpMessage] = useState<FollowUpMessage | null>(null);
  const [config, setConfig] = useState<ExerciseConfig>({
    timeBasedEvents: {
      frequency: 'medium',
      intensity: 'gradual',
      categories: ['media', 'stakeholder', 'internal', 'government', 'competitor']
    },
    aiResponses: {
      style: 'concise',
      tone: 'formal',
      includeSuggestions: true
    },
    voiceSettings: {
      enabled: true,
      voice: 'alloy',
      autoPlayAudio: true,
      transcribeResponses: true
    }
  });

  const { 
    category,
    scenarioId,
    complexity,
    duration,
    isExerciseActive,
    startExercise,
    timeRemaining,
    updateTimeRemaining,
    addDecision,
    fastForward,
  } = useScenarioStore();

  const { events, addEvent, addEvents, handleDecisionEvent } = useEventManagement();
  const { messages, addMessage, removeMessage, handleStakeholderResponse } = useMessageManagement();
  const { showJournalistCall, setShowJournalistCall, handleJournalistResponse } = useJournalistCall();

  const getScenario = () => {
    const scenarioKey = Object.keys(scenarios).find(key => 
      scenarios[key].id === scenarioId && 
      scenarios[key].category === category
    );
    return scenarioKey ? scenarios[scenarioKey] : null;
  };

  const currentScenario = getScenario();
  const scenarioBrief = currentScenario ? {
    title: currentScenario.inbrief.title,
    description: currentScenario.inbrief.summary,
    initialSituation: currentScenario.inbrief.initialSituation
  } : {
    title: "Scenario Not Found",
    description: "Error loading scenario",
    initialSituation: "Please select a valid scenario"
  };

  const handleDecision = async (text: string, isCustom: boolean) => {
    const crisisState = crisisMemoryManager.getCrisisState();
    const newEvents = handleDecisionEvent(text, crisisState.severity);
    
    const aiResponse = await aiService.generateResponse(text, {
      pastDecisions: events.filter(e => e.type === 'decision').map(e => e.content),
      currentSeverity: crisisState.severity,
      stakeholderMood: crisisState.publicTrust < 50 ? 'negative' : 'neutral',
      style: config.aiResponses.style,
      tone: config.aiResponses.tone,
      includeSuggestions: config.aiResponses.includeSuggestions
    });

    if (Math.random() > 0.7) {
      setShowJournalistCall(true);
    }
  };

  const handleTimeSkip = async () => {
    setIsTimeSkipping(true);
    await fastForward();
    setIsTimeSkipping(false);
  };

  useEffect(() => {
    if (!category || !scenarioId || !complexity || !duration) {
      navigate('/scenario-setup');
      return;
    }

    if (!currentScenario) {
      toast({
        title: "Error",
        description: "Invalid scenario selected",
        variant: "destructive"
      });
      navigate('/scenario-setup');
      return;
    }
  }, [category, scenarioId, complexity, duration, navigate, currentScenario]);

  useEffect(() => {
    if (!isExerciseActive && currentScenario) {
      startExercise();
      const durationInMs = {
        '30min': 30 * 60 * 1000,
        '1hr': 60 * 60 * 1000,
        '2hrs': 2 * 60 * 60 * 1000
      }[duration!];
      updateTimeRemaining(durationInMs);

      const initialStep = currentScenario.steps.find(step => step.id === 'start');
      if (initialStep) {
        setAvailableOptions(
          initialStep.options.map(option => ({
            id: Math.random().toString(36).substr(2, 9),
            text: option.text,
            impact: option.impact,
            consequence: option.consequence
          }))
        );
      }
    }
  }, [isExerciseActive, startExercise, duration, updateTimeRemaining, currentScenario]);

  const value = {
    config,
    setConfig,
    events,
    messages,
    currentStepId,
    isTimeSkipping,
    availableOptions,
    timeBasedEvents: crisisTimelineService.getDueEvents(Date.now()),
    followUpMessage,
    timeRemaining,
    scenarioBrief,
    showJournalistCall,
    onDecision: handleDecision,
    onTimeSkip: handleTimeSkip,
    onFollowUpResponse: handleDecision,
    onStakeholderResponse: handleStakeholderResponse,
    onMessageDismiss: removeMessage,
    onJournalistResponse: handleJournalistResponse,
    setShowJournalistCall
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};
