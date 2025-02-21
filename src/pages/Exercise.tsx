
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

  // Get scenario brief from the scenarios data
  const scenarioBrief: ScenarioBrief = {
    title: "Data Breach Crisis",
    description: "A major data breach has been detected in your organization's systems. Customer data may have been compromised.",
    stakeholders: [
      "IT Security Team",
      "Public Relations",
      "Legal Department",
      "Customer Support",
      "Executive Leadership"
    ],
    objectives: [
      "Contain the data breach",
      "Notify affected customers",
      "Manage public relations",
      "Ensure legal compliance",
      "Prevent future breaches"
    ],
    initialSituation: "Initial analysis suggests that customer payment information and personal data may have been exposed. The breach was detected 30 minutes ago, and stakeholders are demanding immediate action."
  };

  useEffect(() => {
    if (!category || !scenarioId || !complexity || !duration) {
      navigate('/scenario-setup');
      return;
    }
  }, [category, scenarioId, complexity, duration, navigate]);

  useEffect(() => {
    if (!isExerciseActive) {
      startExercise();
      const durationInMs = {
        '30min': 30 * 60 * 1000,
        '1hr': 60 * 60 * 1000,
        '2hrs': 2 * 60 * 60 * 1000
      }[duration!];
      updateTimeRemaining(durationInMs);

      // Initialize with first set of options
      setAvailableOptions([
        {
          id: '1',
          text: "Notify all affected customers immediately",
          impact: 'high',
          consequence: "Shows transparency but may cause panic"
        },
        {
          id: '2',
          text: "Conduct thorough investigation before any announcements",
          impact: 'medium',
          consequence: "Gains more information but delays response"
        },
        {
          id: '3',
          text: "Issue preliminary statement acknowledging potential breach",
          impact: 'high',
          consequence: "Balanced approach but may raise questions"
        }
      ]);
    }
  }, [isExerciseActive, startExercise, duration, updateTimeRemaining]);

  const handleDecision = (text: string, isCustom: boolean) => {
    const newEvent: CrisisEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'decision',
      content: text,
      timestamp: Date.now(),
      status: 'active'
    };

    setEvents(prev => [...prev, newEvent]);

    // Generate consequence based on decision
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

    // Update available options based on decision
    generateNewOptions(text);

    toast({
      title: "Decision Made",
      description: "Your response has been recorded and will affect how the situation develops.",
    });
  };

  const generateNewOptions = (lastDecision: string) => {
    // Generate new context-appropriate options based on the last decision
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
    
    // Generate new events based on time skip
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
    
    // Add new stakeholder message
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
            // Add negative consequence for ignoring stakeholder
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
