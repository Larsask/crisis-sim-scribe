
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScenarioStore } from '@/store/scenarioStore';
import { useToast } from "@/components/ui/use-toast";
import { CrisisResponseFlow } from '@/components/exercise/CrisisResponseFlow';
import { CurrentSituation } from '@/components/exercise/CurrentSituation';
import { StakeholderMessages } from '@/components/exercise/StakeholderMessages';
import { JournalistCall } from '@/components/exercise/JournalistCall';
import { scenarios } from '@/data/scenarios';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CrisisEvent {
  id: string;
  type: 'event' | 'decision' | 'consequence' | 'system';
  content: string;
  timestamp: number;
  parentId?: string;
  status: 'active' | 'resolved' | 'escalated';
}

interface StakeholderMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  image?: string;
  urgency: 'normal' | 'urgent' | 'critical';
  responseDeadline?: number;
}

const Exercise = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [events, setEvents] = useState<CrisisEvent[]>([]);
  const [messages, setMessages] = useState<StakeholderMessage[]>([]);
  const [showJournalistCall, setShowJournalistCall] = useState(false);
  const [isTimeSkipping, setIsTimeSkipping] = useState(false);
  
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
    decisions,
    totalScore,
    fastForward,
    currentTime
  } = useScenarioStore();

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
    }
  }, [isExerciseActive, startExercise, duration, updateTimeRemaining]);

  useEffect(() => {
    if (!isExerciseActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      updateTimeRemaining(Math.max(0, timeRemaining - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [isExerciseActive, timeRemaining, updateTimeRemaining]);

  const handleDecision = (text: string, isCustom: boolean) => {
    const impact = isCustom ? 'medium' : 'high';
    const consequence = `Response to the situation: ${text}`;
    
    addDecision(text, impact, consequence);
    
    setEvents(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'decision',
        content: text,
        timestamp: Date.now(),
        status: 'active'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'consequence',
        content: consequence,
        timestamp: Date.now() + 1000,
        parentId: currentStepId,
        status: 'active'
      }
    ]);

    toast({
      title: "Decision Made",
      description: "Your response has been recorded and will affect how the situation develops.",
    });
  };

  const handleMessageResponse = (messageId: string, response: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    handleDecision(response, true);
  };

  const handleMessageDismiss = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    // Add negative consequence for ignoring stakeholder
    setEvents(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type: 'system',
      content: "Stakeholder message ignored - this may have consequences.",
      timestamp: Date.now(),
      status: 'escalated'
    }]);
  };

  const handleTimeSkip = async () => {
    setIsTimeSkipping(true);
    await fastForward();
    
    // Add dynamic events based on time skip
    const newEvents = generateTimeSkipEvents();
    setEvents(prev => [...prev, ...newEvents]);
    
    setIsTimeSkipping(false);
  };

  const generateTimeSkipEvents = () => {
    // Generate dynamic events based on current situation
    return [
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'system',
        content: "Time passes... The situation continues to develop.",
        timestamp: Date.now(),
        status: 'active'
      },
      // Add more dynamic events based on context
    ];
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
          {/* Left Panel - Crisis Response Flow */}
          <div className="space-y-6">
            <CrisisResponseFlow 
              events={events}
              timeRemaining={timeRemaining}
            />
          </div>

          {/* Right Panel - Current Situation & Decisions */}
          <div className="space-y-6">
            <CurrentSituation
              currentStepId={currentStepId}
              onDecision={handleDecision}
              isTimeSkipping={isTimeSkipping}
              onTimeSkip={handleTimeSkip}
            />
          </div>
        </div>

        {/* Floating Stakeholder Messages */}
        <StakeholderMessages
          messages={messages}
          onRespond={handleMessageResponse}
          onDismiss={handleMessageDismiss}
        />

        {/* Journalist Call Modal */}
        {showJournalistCall && (
          <JournalistCall
            onClose={() => setShowJournalistCall(false)}
            onResponse={handleDecision}
          />
        )}
      </div>
    </div>
  );
};

export default Exercise;
