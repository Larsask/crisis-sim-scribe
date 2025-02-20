import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScenarioStore } from '@/store/scenarioStore';
import { useToast } from "@/components/ui/use-toast";
import { AIJournalist } from '@/components/exercise/AIJournalist';
import { PublicStatement } from '@/components/exercise/PublicStatement';
import { ScenarioInbrief } from '@/components/exercise/ScenarioInbrief';
import { dataBreachScenario } from '@/data/scenarios/cyberAttackScenario';
import { formatDistanceToNow } from 'date-fns';

interface ScenarioStep {
  id: string;
  description: string;
  options: {
    text: string;
    impact: 'low' | 'medium' | 'high';
    nextStepId: string;
    consequence: string;
  }[];
}

const SCENARIO_STEPS: { [key: string]: ScenarioStep[] } = {
  'cyber-1': [
    {
      id: 'start',
      description: "Breaking News: A major media outlet has just reported that your company's customer database has been breached. Your phone is ringing with calls from journalists, and social media is exploding with customer concerns. Your security team is still assessing the situation.",
      options: [
        {
          text: "Issue an immediate public statement acknowledging the situation",
          impact: "medium",
          nextStepId: "media-response",
          consequence: "The quick response helps manage public perception, but some details in your statement may need to be corrected later as more information emerges."
        },
        {
          text: "Wait for the security team's complete assessment before making any public statements",
          impact: "high",
          nextStepId: "security-assessment",
          consequence: "The delay in response leads to increased public anxiety and speculation, but you have more accurate information to share."
        },
        {
          text: "Focus on internal communication first",
          impact: "low",
          nextStepId: "internal-comms",
          consequence: "Employees feel informed, but public uncertainty grows due to lack of official response."
        }
      ]
    },
    {
      id: 'media-response',
      description: "Your initial statement has been released. While it demonstrates transparency, journalists are demanding specific details about the breach. Meanwhile, your security team reports potential ongoing unauthorized access to systems.",
      options: [
        {
          text: "Share detailed technical information about the breach",
          impact: "high",
          nextStepId: "technical-details",
          consequence: "The transparency builds trust but may provide attackers with useful information."
        },
        {
          text: "Engage a crisis management firm",
          impact: "medium",
          nextStepId: "crisis-management",
          consequence: "Professional guidance helps structure your response, but adds to response time."
        },
        {
          text: "Focus on immediate customer protection measures",
          impact: "low",
          nextStepId: "customer-protection",
          consequence: "Customers appreciate the protective measures, but media criticism of transparency continues."
        }
      ]
    },
  ],
  'misinfo-1': [
    {
      id: 'start',
      description: "Multiple social media posts claiming your products are causing serious health issues have gone viral. The posts include seemingly convincing but fabricated evidence. Customer service is being flooded with concerned inquiries.",
      options: [
        {
          text: "Launch an immediate fact-checking campaign",
          impact: "high",
          nextStepId: "fact-check",
          consequence: "Your rapid response helps counter the false claims, but engaging directly with the misinformation increases its visibility."
        },
        {
          text: "Contact platform moderators to report false information",
          impact: "medium",
          nextStepId: "platform-response",
          consequence: "Some posts are removed, but screenshots continue to circulate."
        },
        {
          text: "Release detailed product safety documentation",
          impact: "low",
          nextStepId: "safety-docs",
          consequence: "The technical information reassures some customers but doesn't capture as much attention as the viral posts."
        }
      ]
    },
  ],
};

const Exercise = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  
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
    currentTime,
    isFastForwarding
  } = useScenarioStore();

  const [showInbrief, setShowInbrief] = useState(true);
  const [showJournalist, setShowJournalist] = useState(false);
  const [showStatement, setShowStatement] = useState(false);
  const [publicStatement, setPublicStatement] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'system' | 'decision' | 'followup' | 'consequence';
    content: string;
    timestamp: number;
  }>>([]);

  const currentScenario = dataBreachScenario;
  const currentStep = currentScenario.steps.find(step => step.id === currentStepId);

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

  useEffect(() => {
    if (currentStep?.isJournalistCall && !showJournalist) {
      const delay = Math.random() * 10000 + 5000;
      const timer = setTimeout(() => setShowJournalist(true), delay);
      return () => clearTimeout(timer);
    }
  }, [currentStep, showJournalist]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDecision = (text: string, impact: 'low' | 'medium' | 'high', nextStepId: string, consequence: string) => {
    const option = currentStep?.options.find(opt => opt.text === text);
    
    if (option?.requiresFollowUp) {
      setShowFollowUp({
        question: option.requiresFollowUp.question,
        type: option.requiresFollowUp.type,
        onSubmit: (response: string) => {
          addDecision(text, impact, consequence, response);
          setMessages(prev => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              type: 'decision',
              content: text,
              timestamp: Date.now()
            },
            {
              id: Math.random().toString(36).substr(2, 9),
              type: 'followup',
              content: response,
              timestamp: Date.now()
            },
            {
              id: Math.random().toString(36).substr(2, 9),
              type: 'consequence',
              content: consequence,
              timestamp: Date.now()
            }
          ]);
          setCurrentStepId(nextStepId);
        }
      });
    } else {
      addDecision(text, impact, consequence);
      setCurrentStepId(nextStepId);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'decision',
          content: text,
          timestamp: Date.now()
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'consequence',
          content: consequence,
          timestamp: Date.now()
        }
      ]);
    }
    
    toast({
      title: "Decision Made",
      description: consequence,
    });
  };

  const handleFastForward = () => {
    fastForward();
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'system',
        content: "Time has been fast-forwarded by 5 minutes. The situation continues to evolve...",
        timestamp: Date.now()
      }
    ]);
  };

  const handleJournalistResponse = (response: string) => {
    addDecision(
      "Responded to journalist inquiry",
      "high",
      "Your response has been recorded and may appear in future media coverage."
    );
    setShowJournalist(false);
  };

  const handleStatementSubmit = (statement: string) => {
    setPublicStatement(statement);
    setShowStatement(false);
    addDecision(
      "Released public statement",
      "high",
      "Your statement is now your official position and will be referenced by media."
    );
  };

  if (showInbrief) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <ScenarioInbrief
            inbrief={currentScenario.inbrief}
            onAcknowledge={() => setShowInbrief(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
            Score: {totalScore}
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              onClick={handleFastForward}
              disabled={isFastForwarding}
            >
              Fast Forward 5m
            </Button>
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-mono text-xl">
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Crisis Response Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg animate-in fade-in-50 duration-300 ${
                        message.type === 'system' ? 'bg-muted' :
                        message.type === 'decision' ? 'bg-blue-50 dark:bg-blue-900/20' :
                        message.type === 'followup' ? 'bg-green-50 dark:bg-green-900/20' :
                        'bg-yellow-50 dark:bg-yellow-900/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">
                          {message.type === 'system' ? 'System Update' :
                           message.type === 'decision' ? 'Your Decision' :
                           message.type === 'followup' ? 'Follow-up Information' :
                           'Consequence'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{message.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {showStatement && (
              <PublicStatement
                onSubmit={handleStatementSubmit}
                onPostpone={() => setShowStatement(false)}
              />
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Situation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {currentStep?.description}
                </p>
                <div className="space-y-2">
                  {currentStep?.options.map((option, index) => (
                    <Button
                      key={index}
                      className="w-full transition-all hover:scale-102 animate-in fade-in-50 duration-300"
                      variant="outline"
                      onClick={() => handleDecision(option.text, option.impact, option.nextStepId, option.consequence)}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {showJournalist && (
              <AIJournalist
                onResponse={handleJournalistResponse}
                onDecline={() => setShowJournalist(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
