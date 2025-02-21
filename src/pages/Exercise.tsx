import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScenarioStore } from '@/store/scenarioStore';
import { useToast } from "@/components/ui/use-toast";
import { CrisisResponseFlow } from '@/components/exercise/CrisisResponseFlow';
import { CurrentSituation } from '@/components/exercise/CurrentSituation';
import { StakeholderMessages } from '@/components/exercise/StakeholderMessages';
import { JournalistCall } from '@/components/exercise/JournalistCall';
import { scenarios } from '@/data/scenarios';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CrisisEvent, StakeholderMessage, DecisionOption, ScenarioBrief } from '@/types/crisis';

const Exercise = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [events, setEvents] = useState<CrisisEvent[]>([]);
  const [messages, setMessages] = useState<StakeholderMessage[]>([]);
  const [showJournalistCall, setShowJournalistCall] = useState(false);
  const [isTimeSkipping, setIsTimeSkipping] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<DecisionOption[]>([]);
  const [inappropriateResponses, setInappropriateResponses] = useState<string[]>([]);
  
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

  const scenarioBrief: ScenarioBrief = currentScenario ? {
    title: currentScenario.inbrief.title,
    description: currentScenario.inbrief.summary,
    initialSituation: currentScenario.inbrief.initialSituation
  } : {
    title: "Scenario Not Found",
    description: "Error loading scenario",
    initialSituation: "Please select a valid scenario"
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

  const generateConsequence = (text: string, responseType: 'appropriate' | 'inappropriate' | 'neutral'): string => {
    if (responseType === 'inappropriate') {
      return `Your unorthodox approach has raised serious concerns among stakeholders. ${
        inappropriateResponses.length > 0 
          ? "This pattern of inappropriate responses is damaging your organization's credibility."
          : "This response may have serious consequences."
      }`;
    }
    
    if (responseType === 'appropriate') {
      return "Your professional approach has been noted by stakeholders. However, the situation continues to evolve.";
    }
    
    return "Your response has been acknowledged, but stakeholders await more decisive action.";
  };

  const handleDecision = (text: string, isCustom: boolean) => {
    const responseType = evaluateResponse(text);
    
    const newEvent: CrisisEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'decision',
      content: text,
      timestamp: Date.now(),
      status: 'active',
      severity: responseType === 'inappropriate' ? 'high' : 'medium'
    };

    setEvents(prev => [...prev, newEvent]);

    if (responseType === 'inappropriate') {
      setInappropriateResponses(prev => [...prev, text]);
    }

    const consequence: CrisisEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'consequence',
      content: generateConsequence(text, responseType),
      timestamp: Date.now() + 1000,
      parentId: newEvent.id,
      status: responseType === 'inappropriate' ? 'escalated' : 'active',
      severity: responseType === 'inappropriate' ? 'high' : 'medium'
    };

    setEvents(prev => [...prev, consequence]);

    generateNewOptions(text, responseType);

    if (responseType === 'inappropriate') {
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
      setMessages(prev => [...prev, stakeholderReaction]);
    }

    toast({
      title: responseType === 'inappropriate' ? "Warning" : "Decision Recorded",
      description: responseType === 'inappropriate' 
        ? "Your response may have serious consequences."
        : "Your response has been recorded and will affect how the situation develops.",
      variant: responseType === 'inappropriate' ? "destructive" : "default"
    });
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

  return (
    <div className="min-h-screen bg-background p-6">
      <Button 
        variant="outline" 
        onClick={() => navigate('/scenario-setup')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Setup
      </Button>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <CrisisResponseFlow 
              events={events}
              timeRemaining={timeRemaining}
            />
          </div>

          <div className="space-y-6">
            <CurrentSituation
              currentStepId={currentStepId}
              onDecision={handleDecision}
              isTimeSkipping={isTimeSkipping}
              onTimeSkip={handleTimeSkip}
              scenarioBrief={scenarioBrief}
              availableOptions={availableOptions}
            />
          </div>
        </div>

        <StakeholderMessages
          messages={messages}
          onRespond={(messageId, response) => {
            handleDecision(response, true);
            setMessages(prev => prev.filter(m => m.id !== messageId));
          }}
          onDismiss={(messageId) => {
            setMessages(prev => prev.filter(m => m.id !== messageId));
            setEvents(prev => [...prev, {
              id: Math.random().toString(36).substr(2, 9),
              type: 'system',
              content: "Stakeholder message ignored - this may have consequences.",
              timestamp: Date.now(),
              status: 'escalated'
            }]);
          }}
        />

        {showJournalistCall && (
          <JournalistCall
            onClose={() => setShowJournalistCall(false)}
            onResponse={(response) => handleDecision(response, true)}
          />
        )}
      </div>
    </div>
  );
};

export default Exercise;
