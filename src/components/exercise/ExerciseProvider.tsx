import { useState, useEffect } from 'react';
import { ExerciseContext } from './ExerciseContext';
import { useScenarioStore } from '@/store/scenarioStore';
import { aiService } from '@/services/ai-service';
import { crisisTimelineService } from '@/services/crisis-timeline';
import { useToast } from "@/components/ui/use-toast";
import { CrisisEvent, StakeholderMessage, DecisionOption } from '@/types/crisis';
import { TimeBasedEvent, AIResponse, FollowUpMessage } from '@/types/crisis-enhanced';
import { scenarios } from '@/data/scenarios';
import { useNavigate } from 'react-router-dom';

export const ExerciseProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [events, setEvents] = useState<CrisisEvent[]>([]);
  const [messages, setMessages] = useState<StakeholderMessage[]>([]);
  const [showJournalistCall, setShowJournalistCall] = useState(false);
  const [isTimeSkipping, setIsTimeSkipping] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<DecisionOption[]>([]);
  const [inappropriateResponses, setInappropriateResponses] = useState<string[]>([]);
  const [lastDecisionContext, setLastDecisionContext] = useState<{
    type: string;
    timestamp: number;
    content: string;
  } | null>(null);
  const [followUpMessage, setFollowUpMessage] = useState<FollowUpMessage | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  
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

  const generateFollowUpMessage = (aiResponse: AIResponse): FollowUpMessage => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: 'decision_recap',
      title: "Crisis Update",
      content: aiResponse.mainResponse,
      options: aiResponse.suggestedActions.map(action => ({
        text: action.text,
        consequence: action.consequence
      })),
      urgency: 'normal'
    };
  };

  const evaluateResponse = (text: string): 'appropriate' | 'inappropriate' | 'neutral' => {
    const inappropriateKeywords = ['cat', 'party', 'ignore', 'hide', 'lie', 'delay', 'pizza'];
    const appropriateKeywords = ['investigate', 'secure', 'protect', 'inform', 'assess', 'mitigate'];
    
    const hasInappropriate = inappropriateKeywords.some(keyword => text.toLowerCase().includes(keyword));
    const hasAppropriate = appropriateKeywords.some(keyword => text.toLowerCase().includes(keyword));
    
    if (hasInappropriate) return 'inappropriate';
    if (hasAppropriate) return 'appropriate';
    return 'neutral';
  };

  const generateContextAwareResponse = (text: string, responseType: 'appropriate' | 'inappropriate' | 'neutral'): string => {
    const timeSinceLastDecision = lastDecisionContext ? Date.now() - lastDecisionContext.timestamp : null;
    const isRepetitiveAction = lastDecisionContext?.content.toLowerCase().includes(text.toLowerCase());
    
    if (responseType === 'inappropriate') {
      if (inappropriateResponses.length > 2) {
        return "Your continued pattern of questionable decisions has severely damaged stakeholder trust. Board members are now expressing serious concerns about crisis management leadership.";
      }
      return `Your approach has raised serious concerns. ${isRepetitiveAction ? "Repeating ineffective strategies is creating additional risks." : "This decision may have long-term consequences for stakeholder trust."}`;
    }
    
    if (responseType === 'appropriate') {
      if (timeSinceLastDecision && timeSinceLastDecision < 300000) { // 5 minutes
        return "Quick, decisive action noted. However, stakeholders are concerned about the rapid pace of decisions without proper consultation.";
      }
      return "Your professional approach has been acknowledged. Stakeholders are cautiously optimistic but expect concrete follow-up actions.";
    }
    
    return "While your response has been noted, stakeholders expect more specific actions to address their concerns.";
  };

  const generateContextAwareFollowUp = (text: string, responseType: 'appropriate' | 'inappropriate' | 'neutral'): StakeholderMessage => {
    const followUpTypes = [
      'decision',
      'summary',
      'stakeholder',
      'update'
    ];
    
    const followUpType = followUpTypes[Math.floor(Math.random() * followUpTypes.length)];
    
    let followUp: StakeholderMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: '',
      content: '',
      timestamp: Date.now(),
      urgency: 'normal',
      type: 'text',
      status: 'unread',
      responseDeadline: Date.now() + 300000
    };

    if (text.toLowerCase().includes('investigation')) {
      switch(followUpType) {
        case 'decision':
          followUp = {
            ...followUp,
            sender: "Investigation Team",
            content: "Initial findings raise concerns about systemic issues. Should we expand the scope of our investigation?",
            urgency: 'urgent',
            responseOptions: [
              { text: "Yes, expand the investigation scope", impact: 'positive' },
              { text: "Maintain current scope but accelerate timeline", impact: 'neutral' },
              { text: "Complete current phase before deciding", impact: 'negative' }
            ]
          };
          break;
        case 'summary':
          followUp = {
            ...followUp,
            sender: "Legal Department",
            content: "Document review reveals potential compliance gaps. Immediate attention required.",
            urgency: 'critical'
          };
          break;
        default:
          followUp = {
            ...followUp,
            sender: "Strategic Planning",
            content: "Teams are compiling findings. How should we proceed with stakeholder communication?",
            urgency: 'urgent'
          };
      }
    } else if (text.toLowerCase().includes('statement')) {
      switch(followUpType) {
        case 'stakeholder':
          followUp = {
            ...followUp,
            sender: "Media Relations",
            content: "Press is requesting more details about our statement. How should we respond?",
            urgency: 'critical',
            type: 'email'
          };
          break;
        case 'update':
          followUp = {
            ...followUp,
            sender: "Communications Team",
            content: "Draft statement ready for review. Key stakeholders suggest additional context needed.",
            urgency: 'urgent'
          };
          break;
        default:
          followUp = {
            ...followUp,
            sender: "PR Team",
            content: "Social media response to our statement is mixed. Should we issue a clarification?",
            urgency: 'urgent'
          };
      }
    } else {
      followUp = {
        ...followUp,
        sender: "Crisis Management Team",
        content: "New developments require immediate attention. How should we adjust our strategy?",
        urgency: 'urgent',
        type: 'email'
      };
    }

    return followUp;
  };

  const generateFollowUpEvent = (text: string, responseType: 'appropriate' | 'inappropriate' | 'neutral'): CrisisEvent => {
    const baseEvent: CrisisEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'event',
      content: "Teams are analyzing the situation and preparing next steps.",
      timestamp: Date.now() + 2000,
      status: 'active',
      severity: 'medium'
    };

    if (text.toLowerCase().includes('investigation')) {
      baseEvent.content = "Internal teams begin gathering documentation. Legal department advises on compliance requirements.";
      baseEvent.severity = 'high';
    } else if (text.toLowerCase().includes('statement')) {
      baseEvent.content = "Communications team drafts initial statement. PR advisors suggest media strategy adjustment.";
    } else if (text.toLowerCase().includes('stakeholder')) {
      baseEvent.content = "Key stakeholders acknowledge your outreach. Some request additional details.";
    } else {
      baseEvent.content = "Teams begin implementing your decision. Initial feedback suggests mixed reactions.";
    }

    return baseEvent;
  };

  const handleDecision = async (text: string, isCustom: boolean) => {
    const responseType = evaluateResponse(text);
    setLastDecisionContext({
      type: responseType,
      timestamp: Date.now(),
      content: text
    });

    const aiResponse = await aiService.generateResponse(text, {
      pastDecisions: events.filter(e => e.type === 'decision').map(e => e.content),
      currentSeverity: responseType === 'inappropriate' ? 'high' : 'medium',
      stakeholderMood: responseType === 'inappropriate' ? 'negative' : 'neutral'
    });

    const newEvents: CrisisEvent[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'decision',
        content: text,
        timestamp: Date.now(),
        status: 'active',
        severity: responseType === 'inappropriate' ? 'high' : 'medium'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'consequence',
        content: aiResponse.mainResponse,
        timestamp: Date.now() + 1000,
        status: responseType === 'inappropriate' ? 'escalated' : 'active',
        severity: responseType === 'inappropriate' ? 'high' : 'medium'
      }
    ];

    setEvents(prev => [...prev, ...newEvents]);
    generateNewOptions(text, responseType);

    const followUp = generateFollowUpMessage(aiResponse);
    setFollowUpMessage(followUp);

    if (responseType === 'inappropriate') {
      setInappropriateResponses(prev => [...prev, text]);
      const stakeholderReaction = generateStakeholderReaction(text, 'inappropriate');
      setMessages(prev => [...prev, stakeholderReaction]);
    }

    if (Math.random() > 0.7) {
      setShowJournalistCall(true);
    }
  };

  const generateNewOptions = (lastDecision: string, responseType: 'appropriate' | 'inappropriate' | 'neutral') => {
    let newOptions: DecisionOption[] = [];
    
    if (responseType === 'inappropriate') {
      newOptions = [
        {
          id: Math.random().toString(36).substr(2, 9),
          text: "Issue formal apology for previous response",
          impact: 'high',
          consequence: "Attempts to restore credibility",
          requiresFollowUp: {
            question: "Draft your apology statement:",
            type: 'text',
            validation: "length:200"
          }
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          text: "Call emergency stakeholder meeting",
          impact: 'high',
          consequence: "Addresses growing concerns",
          requiresFollowUp: {
            question: "What will you address in the meeting?",
            type: 'text',
            validation: "length:150"
          }
        }
      ];
    } else {
      if (lastDecision.toLowerCase().includes('investigation')) {
        newOptions = [
          {
            id: Math.random().toString(36).substr(2, 9),
            text: "Share preliminary findings with stakeholders",
            impact: 'high',
            consequence: "Demonstrates transparency but may reveal vulnerabilities",
            requiresFollowUp: {
              question: "What key findings will you share?",
              type: 'text',
              validation: "length:200"
            }
          },
          {
            id: Math.random().toString(36).substr(2, 9),
            text: "Implement immediate corrective measures",
            impact: 'high',
            consequence: "Shows decisive action but may admit fault",
            requiresFollowUp: {
              question: "Outline the corrective measures:",
              type: 'text',
              validation: "length:150"
            }
          }
        ];
      } else {
        newOptions = [
          {
            id: Math.random().toString(36).substr(2, 9),
            text: "Develop comprehensive response plan",
            impact: 'high',
            consequence: "Strategic approach but requires time",
            requiresFollowUp: {
              question: "Outline key elements of your plan:",
              type: 'text',
              validation: "length:200"
            }
          },
          {
            id: Math.random().toString(36).substr(2, 9),
            text: "Engage external consultants",
            impact: 'medium',
            consequence: "Expert support but increases costs",
            requiresFollowUp: {
              question: "Specify the expertise needed:",
              type: 'text',
              validation: "length:150"
            }
          }
        ];
      }
    }
    
    setAvailableOptions(newOptions);
  };

  const handleTimeSkip = async () => {
    setIsTimeSkipping(true);
    await fastForward();
    
    const escalation = inappropriateResponses.length > 0
      ? "Previous inappropriate responses have damaged our reputation. Media scrutiny intensifies."
      : "Situation continues to develop. Stakeholders await our next move.";

    const newEvents: CrisisEvent[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'system',
        content: escalation,
        timestamp: Date.now(),
        status: inappropriateResponses.length > 0 ? 'escalated' : 'active',
        severity: inappropriateResponses.length > 0 ? 'high' : 'medium'
      }
    ];
    
    setEvents(prev => [...prev, ...newEvents]);
    
    if (inappropriateResponses.length === 0) {
      const newMessage: StakeholderMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "Strategic Planning",
        content: "We need to formulate our next steps carefully. What direction should we take?",
        timestamp: Date.now(),
        urgency: 'urgent',
        responseDeadline: Date.now() + 600000,
        type: 'text',
        status: 'unread'
      };
      setMessages(prev => [...prev, newMessage]);
    }
    
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

  const handleStakeholderResponse = (messageId: string, response: string) => {
    handleDecision(response, true);
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const handleMessageDismiss = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    setEvents(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type: 'system',
      content: "Stakeholder message ignored - this may have consequences.",
      timestamp: Date.now(),
      status: 'escalated'
    }]);
  };

  const handleJournalistResponse = (response: string) => {
    handleDecision(response, true);
  };

  const handleFollowUpResponse = (response: string) => {
    handleDecision(response, true);
    setFollowUpMessage(null);
  };

  const generateStakeholderReaction = (text: string, responseType: 'appropriate' | 'inappropriate' | 'neutral'): StakeholderMessage => {
    const stakeholderReaction: StakeholderMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: "Crisis Management Team",
      content: "Your recent decisions are causing significant concern. We need to reassess our approach immediately.",
      timestamp: Date.now(),
      urgency: 'critical',
      responseDeadline: Date.now() + 300000,
      type: 'email',
      status: 'unread'
    };
    return stakeholderReaction;
  };

  const value = {
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
    onDecision: handleDecision,
    onTimeSkip: handleTimeSkip,
    onFollowUpResponse: handleFollowUpResponse,
    onStakeholderResponse: handleStakeholderResponse,
    onMessageDismiss: handleMessageDismiss,
    onJournalistResponse: handleJournalistResponse,
    setShowJournalistCall
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};
