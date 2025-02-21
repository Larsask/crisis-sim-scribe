import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScenarioStore } from '@/store/scenarioStore';
import { useToast } from "@/components/ui/use-toast";
import { AIJournalist } from '@/components/exercise/AIJournalist';
import { PublicStatement } from '@/components/exercise/PublicStatement';
import { ScenarioInbrief } from '@/components/exercise/ScenarioInbrief';
import { FollowUpPrompt } from '@/components/exercise/FollowUpPrompt';
import { scenarios } from '@/data/scenarios';
import { formatDistanceToNow } from 'date-fns';
import { ExerciseQuestionnaire } from '@/components/exercise/ExerciseQuestionnaire';
import { ExerciseSummary } from '@/components/exercise/ExerciseSummary';

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
  const [showFollowUp, setShowFollowUp] = useState<{
    question: string;
    type: 'text' | 'phone' | 'email' | 'time';
    validation?: string;
    onSubmit: (response: string) => void;
  } | null>(null);
  const [publicStatement, setPublicStatement] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'system' | 'decision' | 'followup' | 'consequence';
    content: string;
    timestamp: number;
  }>>([]);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [questionnaireResponses, setQuestionnaireResponses] = useState<{
    situationHandling: string;
    lessonsLearned: string;
    keyTakeaways: string[];
  } | null>(null);

  const getCurrentScenario = () => {
    if (!scenarioId) return null;
    const scenarioMap: { [key: string]: string } = {
      'reputation-1': 'executiveMisconductScenario',
      'cyber-1': 'ransomwareScenario',
      'misinfo-1': 'viralDisinfoScenario',
      'ai-1': 'aiHiringScenario',
      'hybrid-1': 'supplyChainScenario',
      'realtime-1': 'liveEventScenario',
      'insider-1': 'engineerThreatScenario',
    };
    
    const scenarioKey = scenarioMap[scenarioId];
    return scenarioKey ? scenarios[scenarioKey as keyof typeof scenarios] : null;
  };

  const currentScenario = getCurrentScenario();
  const currentStep = currentScenario?.steps.find(step => step.id === currentStepId);

  useEffect(() => {
    if (!category || !scenarioId || !complexity || !duration) {
      navigate('/scenario-setup');
      return;
    }

    console.log('Current Scenario:', currentScenario);
  }, [category, scenarioId, complexity, duration, navigate, currentScenario]);

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

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleEndExercise();
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (!showInbrief && !showQuestionnaire && !showSummary) {
      const eventInterval = setInterval(() => {
        const shouldTriggerEvent = Math.random() < 0.3;
        if (shouldTriggerEvent) {
          generateDynamicEvent();
        }
      }, 30000);

      return () => clearInterval(eventInterval);
    }
  }, [showInbrief, showQuestionnaire, showSummary, currentStepId]);

  const generateDynamicEvent = () => {
    const possibleEvents = [
      {
        type: 'social_media',
        description: 'A trending hashtag related to the situation is gaining traction.',
        options: [
          {
            text: "Monitor social media sentiment",
            impact: "low" as const,
            consequence: "Gained better understanding of public perception."
          },
          {
            text: "Engage with key influencers",
            impact: "medium" as const,
            consequence: "Some influencers are willing to hear your side."
          }
        ]
      },
      {
        type: 'media_update',
        description: 'A major news outlet is preparing to run a story.',
        options: [
          {
            text: "Provide official statement",
            impact: "high" as const,
            consequence: "Statement included in the coverage, showing proactive response."
          },
          {
            text: "Request delay for fact-checking",
            impact: "medium" as const,
            consequence: "Outlet agrees to verify facts but story will still run."
          }
        ]
      },
      {
        type: 'stakeholder_reaction',
        description: 'Key stakeholders are demanding immediate updates.',
        options: [
          {
            text: "Hold emergency briefing",
            impact: "high" as const,
            consequence: "Stakeholders appreciate direct communication but expect concrete actions."
          },
          {
            text: "Send detailed written update",
            impact: "medium" as const,
            consequence: "Update sent but some stakeholders want more direct engagement."
          }
        ]
      }
    ];

    const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
    
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type: 'system',
      content: event.description,
      timestamp: Date.now()
    }]);

    if (currentStep) {
      currentStep.options = [...currentStep.options, ...event.options];
    }
  };

  const handleEndExercise = () => {
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = (responses: {
    situationHandling: string;
    lessonsLearned: string;
    keyTakeaways: string[];
  }) => {
    setQuestionnaireResponses(responses);
    setShowQuestionnaire(false);
    setShowSummary(true);
  };

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
        validation: option.requiresFollowUp.validation,
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
          setShowFollowUp(null);
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

  if (!currentScenario) {
    navigate('/scenario-setup');
    return null;
  }

  if (showSummary && questionnaireResponses) {
    return (
      <ExerciseSummary
        scenarioTitle={currentScenario.inbrief.title}
        duration={duration || ''}
        decisions={decisions}
        questionnaire={questionnaireResponses}
      />
    );
  }

  if (showQuestionnaire) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <ExerciseQuestionnaire onComplete={handleQuestionnaireComplete} />
        </div>
      </div>
    );
  }

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
          <div className="text-lg font-semibold">
            Impact Events: High ({decisions.filter(d => d.impact === 'high').length}) | 
            Medium ({decisions.filter(d => d.impact === 'medium').length}) | 
            Low ({decisions.filter(d => d.impact === 'low').length})
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              onClick={handleFastForward}
              disabled={isFastForwarding}
            >
              Fast Forward 5m
            </Button>
            <Button
              variant="outline"
              onClick={handleEndExercise}
            >
              End Exercise
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

            {showFollowUp && (
              <FollowUpPrompt
                question={showFollowUp.question}
                type={showFollowUp.type}
                validation={showFollowUp.validation}
                onSubmit={showFollowUp.onSubmit}
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
