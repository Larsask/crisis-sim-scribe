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
    stakeholders: currentScenario.inbrief.stakeholders,
    objectives: currentScenario.inbrief.objectives,
    initialSituation: currentScenario.inbrief.initialSituation
  } : {
    title: "Scenario Not Found",
    description: "Error loading scenario",
    stakeholders: [],
    objectives: [],
    initialSituation: "Please select a valid scenario"
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

  const handleDecision = (text: string, isCustom: boolean) => {
    const newEvent: CrisisEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'decision',
      content: text,
      timestamp: Date.now(),
      status: 'active'
    };

    setEvents(prev => [...prev, newEvent]);

    const consequence: CrisisEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'consequence',
      content: isCustom ? 
        `Your response leads to increased media scrutiny and stakeholder concern.` :
        `Standard protocol followed, stakeholders notified according to procedure.`,
      timestamp: Date.now() + 1000,
      parentId: newEvent.id,
      status: 'active'
    };

    setEvents(prev => [...prev, consequence]);

    generateNewOptions(text);

    toast({
      title: "Decision Made",
      description: "Your response has been recorded and will affect how the situation develops.",
    });
  };

  const generateNewOptions = (lastDecision: string) => {
    const newOptions: DecisionOption[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        text: "Engage external cybersecurity firm",
        impact: 'high',
        consequence: "Professional assessment but increased costs"
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        text: "Implement immediate security patches",
        impact: 'medium',
        consequence: "Quick fix but may not address root cause"
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        text: "Form crisis management task force",
        impact: 'high',
        consequence: "Coordinated response but takes time to organize"
      }
    ];
    
    setAvailableOptions(newOptions);
  };

  const handleTimeSkip = async () => {
    setIsTimeSkipping(true);
    await fastForward();
    
    const newEvents: CrisisEvent[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'system',
        content: "Media coverage intensifies as news of the breach spreads.",
        timestamp: Date.now(),
        status: 'active'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'event',
        content: "Customer support reports increasing call volume about potential data exposure.",
        timestamp: Date.now() + 1000,
        status: 'active'
      }
    ];
    
    setEvents(prev => [...prev, ...newEvents]);
    
    const newMessage: StakeholderMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: "Legal Department",
      content: "Regulatory bodies need to be notified within the next hour. Please provide direction on our disclosure strategy.",
      timestamp: Date.now(),
      urgency: 'urgent',
      responseDeadline: Date.now() + 3600000 // 1 hour
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTimeSkipping(false);
  };

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
