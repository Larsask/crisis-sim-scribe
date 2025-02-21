import { useState, useEffect, useCallback } from 'react';
import { ExerciseContext } from './ExerciseContext';
import { useScenarioStore } from '@/store/scenarioStore';
import { useEventManagement } from '@/hooks/useEventManagement';
import { useMessageManagement } from '@/hooks/useMessageManagement';
import { useJournalistCall } from '@/hooks/useJournalistCall';
import { aiService } from '@/services/ai-service';
import { crisisTimelineService } from '@/services/crisis-timeline';
import { useToast } from "@/components/ui/use-toast";
import { FollowUpMessage, ExerciseConfig, AIResponse } from '@/types/crisis-enhanced';
import { scenarios } from '@/data/scenarios';
import { useNavigate } from 'react-router-dom';
import { crisisMemoryManager } from '@/utils/crisis-memory';
import { DecisionOption, CrisisEvent } from '@/types/crisis';
import { generateDynamicUpdates, shouldTriggerJournalistCall } from '@/utils/scenario-generator';

const durationToMs = (duration: string): number => {
  switch (duration) {
    case '30min':
      return 30 * 60 * 1000;
    case '1hr':
      return 60 * 60 * 1000;
    case '2hrs':
      return 2 * 60 * 60 * 1000;
    default:
      return 30 * 60 * 1000;
  }
};

export const ExerciseProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [isTimeSkipping, setIsTimeSkipping] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<DecisionOption[]>([]);
  const [followUpMessage, setFollowUpMessage] = useState<FollowUpMessage | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [exerciseStartTime] = useState<number>(Date.now());
  const [isExerciseEnded, setIsExerciseEnded] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<CrisisEvent[]>([]);

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
  const { 
    showJournalistCall, 
    setShowJournalistCall, 
    handleJournalistResponse,
    journalistCallState,
    setJournalistCallState
  } = useJournalistCall();

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

  const handleDecision = useCallback(async (text: string, isCustom: boolean) => {
    const crisisState = crisisMemoryManager.getCrisisState();
    const newEvents = handleDecisionEvent(text, crisisState.severity);
    
    const updates = await generateDynamicUpdates(text, crisisState, events);
    setPendingUpdates(prev => [...prev, ...updates]);

    try {
      const newOptions = await aiService.generateNewOptions({
        decision: text,
        crisisState,
        pastEvents: events
      });
      setAvailableOptions(newOptions);
    } catch (error) {
      console.error('Error generating new options:', error);
      setAvailableOptions([
        {
          id: '1',
          text: 'Monitor the situation',
          impact: 'low',
          consequence: 'Allows time for proper assessment'
        }
      ]);
    }

    const response = await aiService.generateResponse(text, {
      pastDecisions: events.filter(e => e.type === 'decision').map(e => e.content),
      currentSeverity: crisisState.severity,
      stakeholderMood: crisisState.publicTrust < 50 ? 'negative' : 'neutral',
      style: config.aiResponses.style,
      tone: config.aiResponses.tone,
      includeSuggestions: config.aiResponses.includeSuggestions
    });

    setAiResponse(response);

    if (shouldTriggerJournalistCall(crisisState, events)) {
      setJournalistCallState('incoming');
      setShowJournalistCall(true);
    }
  }, [events, config, setAvailableOptions, handleDecisionEvent]);

  const handleFollowUpResponse = useCallback((response: string) => {
    handleDecision(response, true);
    setFollowUpMessage(null);
  }, [handleDecision]);

  const handleTimeSkip = useCallback(async () => {
    setIsTimeSkipping(true);
    const crisisState = crisisMemoryManager.getCrisisState();
    
    const skipUpdates = await generateDynamicUpdates(null, crisisState, events, true);
    
    for (const update of skipUpdates) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addEvent(update);

      if (update.type === 'stakeholder' && update.severity === 'high') {
        try {
          const message = await generateStakeholderMessage(crisisState, [...events, update]);
          if (message) {
            addMessage({
              id: Math.random().toString(36).substr(2, 9),
              sender: update.content.split(':')[0],
              content: message.content,
              timestamp: Date.now(),
              type: message.type,
              urgency: message.urgency,
              status: 'unread',
              responseDeadline: Date.now() + 300000
            });
          }
        } catch (error) {
          console.error('Error generating stakeholder message:', error);
        }
      }
    }

    if (shouldTriggerJournalistCall(crisisState, events, true)) {
      setJournalistCallState('incoming');
      setShowJournalistCall(true);
    }

    setIsTimeSkipping(false);
  }, [events, addEvent, addMessage]);

  const endExercise = useCallback(() => {
    setIsExerciseEnded(true);
    navigate('/exercise/assessment');
  }, [navigate]);

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

  useEffect(() => {
    if (!isExerciseActive || isExerciseEnded) return;

    const timer = setInterval(() => {
      const elapsed = Date.now() - exerciseStartTime;
      const remaining = Math.max(0, duration ? durationToMs(duration) - elapsed : 0);
      
      updateTimeRemaining(remaining);
      
      if (remaining <= 0) {
        endExercise();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isExerciseActive, isExerciseEnded, exerciseStartTime, duration, updateTimeRemaining, endExercise]);

  useEffect(() => {
    if (!isExerciseActive || isExerciseEnded) return;

    const updateInterval = setInterval(async () => {
      if (pendingUpdates.length > 0) {
        const update = pendingUpdates[0];
        addEvent(update);
        setPendingUpdates(prev => prev.slice(1));

        if (update.type === 'stakeholder' && update.severity === 'high') {
          const crisisState = crisisMemoryManager.getCrisisState();
          const stakeholderName = update.content.split(':')[0];
          
          const message = {
            type: 'email' as const,
            content: `Urgent response needed regarding ${update.content}`,
            urgency: 'urgent' as const
          };

          if (message) {
            addMessage({
              id: Math.random().toString(36).substr(2, 9),
              sender: stakeholderName,
              content: message.content,
              timestamp: Date.now(),
              type: message.type,
              urgency: message.urgency,
              status: 'unread',
              responseDeadline: Date.now() + 300000
            });
          }
        }
      }
    }, 3000);

    return () => clearInterval(updateInterval);
  }, [isExerciseActive, isExerciseEnded, pendingUpdates, events, addEvent, addMessage]);

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
    aiResponse,
    timeRemaining,
    scenarioBrief,
    showJournalistCall,
    isExerciseEnded,
    journalistCallState,
    onDecision: handleDecision,
    onTimeSkip: handleTimeSkip,
    onFollowUpResponse: handleFollowUpResponse,
    onStakeholderResponse: handleStakeholderResponse,
    onMessageDismiss: removeMessage,
    onJournalistResponse: handleJournalistResponse,
    setShowJournalistCall,
    endExercise
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};
