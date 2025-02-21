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
import { ScenarioOption } from '@/types/scenario';
import { ArrowLeft } from 'lucide-react';
import { CrisisFlowchart } from '@/components/exercise/CrisisFlowchart';

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
    groupId?: string;
  }>>([]);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [lastEventTime, setLastEventTime] = useState(Date.now());
  const [questionnaireResponses, setQuestionnaireResponses] = useState<{
    situationHandling: string;
    lessonsLearned: string;
    keyTakeaways: string[];
  } | null>(null);

  const getCurrentScenario = () => {
    if (!scenarioId) return null;
    const scenarioMap = {
      'insider-1': 'engineerThreatScenario',
      'insider-2': 'executiveLeakScenario',
      'insider-3': 'contractorBreachScenario',
      'insider-4': 'employeeSabotageScenario',
      'insider-5': 'privilegedAccessScenario',
      'cyber-1': 'ransomwareScenario',
      'cyber-2': 'dataBreachScenario',
      'cyber-3': 'ddosScenario',
      'cyber-4': 'phishingScenario',
      'cyber-5': 'insiderThreatScenario',
      'misinfo-1': 'viralDisinfoScenario',
      'misinfo-2': 'politicalDisinfoScenario',
      'misinfo-3': 'scientificDisinfoScenario',
      'misinfo-4': 'productDisinfoScenario',
      'misinfo-5': 'financialDisinfoScenario',
      'ai-1': 'aiHiringScenario',
      'ai-2': 'aiPrivacyScenario',
      'ai-3': 'aiDecisionScenario',
      'ai-4': 'aiSecurityScenario',
      'ai-5': 'aiEthicsScenario',
      'hybrid-1': 'supplyChainScenario',
      'hybrid-3': 'socialEngineeringScenario',
      'realtime-2': 'serviceOutageScenario',
      'realtime-3': 'systemFailureScenario',
      'realtime-4': 'securityBreachScenario',
      'realtime-5': 'infrastructureScenario',
      'reputation-3': 'employeeScandalScenario',
      'reputation-5': 'customerDataScenario'
    };
    
    return scenarios[scenarioMap[scenarioId] as keyof typeof scenarios] || null;
  };

  const currentScenario = getCurrentScenario();
  const currentStep = currentScenario?.steps.find(step => step.id === currentStepId);

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
    if (!showInbrief && !showQuestionnaire && !showSummary) {
      const checkJournalist = () => {
        const timeSinceLastEvent = Date.now() - lastEventTime;
        const shouldCall = Math.random() < 0.3 && timeSinceLastEvent > 30000;
        if (shouldCall && !showJournalist) {
          setShowJournalist(true);
          setLastEventTime(Date.now());
        }
      };

      const journalistInterval = setInterval(checkJournalist, 15000);
      return () => clearInterval(journalistInterval);
    }
  }, [showInbrief, showQuestionnaire, showSummary, lastEventTime, showJournalist]);

  useEffect(() => {
    if (!showInbrief && !showQuestionnaire && !showSummary) {
      const generateEvents = () => {
        const timeSinceLastEvent = Date.now() - lastEventTime;
        const shouldTriggerEvent = Math.random() < 0.4 && timeSinceLastEvent > 20000;
        
        if (shouldTriggerEvent) {
          generateDynamicEvent();
          setLastEventTime(Date.now());
        }
      };

      const eventInterval = setInterval(generateEvents, 10000);
      return () => clearInterval(eventInterval);
    }
  }, [showInbrief, showQuestionnaire, showSummary, lastEventTime]);

  const generateDynamicEvent = () => {
    const pendingDecisions = currentStep?.options.length || 0;
    if (pendingDecisions > 5) return;

    const timeSinceLastEvent = Date.now() - lastEventTime;
    if (timeSinceLastEvent < 45000) return;

    const possibleEvents = [
      {
        type: 'direct_consequence',
        description: `Following your ${decisions.length > 0 ? 'decision to ' + decisions[decisions.length - 1].decision : 'recent actions'}...`,
        options: getConsequentialOptions()
      },
      {
        type: 'stakeholder_update',
        description: 'A key stakeholder is responding to the situation.',
        options: getStakeholderOptions()
      },
      {
        type: 'media_development',
        description: 'The media narrative is evolving.',
        options: getMediaOptions()
      }
    ];

    setMessages(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type: 'system',
      content: "Analyzing situation developments...",
      timestamp: Date.now()
    }]);

    setTimeout(() => {
      const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
      const eventGroupId = Math.random().toString(36).substr(2, 9);
      
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        type: 'system',
        content: event.description,
        timestamp: Date.now(),
        groupId: eventGroupId
      }]);

      if (currentStep) {
        const newOptions = event.options.map((option, index) => ({
          ...option,
          text: `[${decisions.length + index + 1}] ${option.text}`,
          groupId: eventGroupId
        }));
        currentStep.options = [...currentStep.options, ...newOptions];
      }
    }, 8000);

    setLastEventTime(Date.now());
  };

  const getConsequentialOptions = () => {
    const lastDecision = decisions[decisions.length - 1];
    if (!lastDecision) return [];

    return [
      {
        text: "Address emerging concerns",
        impact: "medium" as const,
        nextStepId: currentStepId,
        consequence: "Your response helps clarify the situation.",
        requiresFollowUp: {
          question: "How will you address these concerns?",
          type: "text" as const,
          validation: "length:200"
        }
      },
      {
        text: "Revise approach based on feedback",
        impact: "high" as const,
        nextStepId: currentStepId,
        consequence: "Strategy adjusted based on new information.",
        requiresFollowUp: {
          question: "What adjustments will you make?",
          type: "text" as const,
          validation: "length:200"
        }
      }
    ];
  };

  const getStakeholderOptions = () => {
    return [
      {
        text: "Schedule emergency briefing",
        impact: "high" as const,
        nextStepId: currentStepId,
        consequence: "Stakeholders appreciate the direct communication.",
        requiresFollowUp: {
          question: "What key points will you cover?",
          type: "text" as const,
          validation: "length:200"
        }
      },
      {
        text: "Provide written update",
        impact: "medium" as const,
        nextStepId: currentStepId,
        consequence: "Update distributed to all stakeholders.",
        requiresFollowUp: {
          question: "Draft your update:",
          type: "text" as const,
          validation: "length:200"
        }
      }
    ];
  };

  const getMediaOptions = () => {
    return [
      {
        text: "Issue clarifying statement",
        impact: "high" as const,
        nextStepId: currentStepId,
        consequence: "Your statement shapes the narrative.",
        requiresFollowUp: {
          question: "Draft your statement:",
          type: "text" as const,
          validation: "length:200"
        }
      },
      {
        text: "Monitor media coverage",
        impact: "low" as const,
        nextStepId: currentStepId,
        consequence: "Better understanding of public perception gained."
      }
    ];
  };

  const handleDecision = (text: string, impact: 'low' | 'medium' | 'high', nextStepId: string, consequence: string) => {
    const option = currentStep?.options.find(opt => opt.text === text);
    
    toast({
      title: "Important!",
      description: "Your response will impact how the situation develops. Consider carefully.",
      duration: 5000
    });
    
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
    setLastEventTime(Date.now());
  };

  const handleStatementSubmit = (statement: string) => {
    setPublicStatement(statement);
    setShowStatement(false);
    addDecision(
      "Released public statement",
      "high",
      "Your statement is now your official position and will be referenced by media."
    );
    setLastEventTime(Date.now());
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

  const handleEndExercise = () => {
    setShowQuestionnaire(true);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderMessages = () => {
    return messages.map((message) => {
      const relatedOptions = currentStep?.options.filter(opt => opt.groupId === message.groupId);
      
      return (
        <div key={message.id} className="space-y-4">
          <div className={`p-4 rounded-lg animate-in fade-in-50 duration-300 ${
            message.type === 'system' ? 'bg-muted' :
            message.type === 'decision' ? 'bg-blue-50 dark:bg-blue-900/20' :
            message.type === 'followup' ? 'bg-green-50 dark:bg-green-900/20' :
            'bg-yellow-50 dark:bg-yellow-900/20'
          }`}>
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
          
          {relatedOptions && relatedOptions.length > 0 && (
            <div className="ml-4 space-y-2">
              {relatedOptions.map((option, index) => (
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
          )}
        </div>
      );
    });
  };

  if (!currentScenario) {
    navigate('/scenario-setup');
    return null;
  }

  if (showSummary && questionnaireResponses) {
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
        <div className="max-w-4xl mx-auto">
          <ExerciseSummary
            scenarioTitle={currentScenario.inbrief.title}
            duration={duration || ''}
            decisions={decisions}
            questionnaire={questionnaireResponses}
          />
        </div>
      </div>
    );
  }

  if (showQuestionnaire) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Button 
          variant="outline" 
          onClick={() => setShowQuestionnaire(false)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Exercise
        </Button>
        <div className="max-w-4xl mx-auto">
          <ExerciseQuestionnaire onComplete={handleQuestionnaireComplete} />
        </div>
      </div>
    );
  }

  if (showInbrief) {
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
                <CardTitle>Crisis Response Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <CrisisFlowchart
                  messages={messages}
                  currentOptions={currentStep?.options}
                  onDecision={handleDecision}
                />
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
                {currentStep?.options && currentStep.options.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium mb-2">Available Actions:</h3>
                    {currentStep.options.map((option, index) => (
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
                )}
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
