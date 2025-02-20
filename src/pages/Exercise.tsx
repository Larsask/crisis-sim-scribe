
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScenarioStore } from '@/store/scenarioStore';
import { useToast } from "@/components/ui/use-toast";

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
    // ... Add more steps for this scenario
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
    // ... Add more steps for this scenario
  ],
  // ... Add more scenarios
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
    totalScore
  } = useScenarioStore();

  // Get current scenario steps
  const currentScenarioSteps = scenarioId ? SCENARIO_STEPS[scenarioId] : [];
  const currentStep = currentScenarioSteps?.find(step => step.id === currentStepId);

  // Redirect if not properly configured
  useEffect(() => {
    if (!category || !scenarioId || !complexity || !duration) {
      navigate('/scenario-setup');
      return;
    }
  }, [category, scenarioId, complexity, duration, navigate]);

  // Start exercise and timer
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

  // Timer countdown
  useEffect(() => {
    if (!isExerciseActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      updateTimeRemaining(Math.max(0, timeRemaining - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [isExerciseActive, timeRemaining, updateTimeRemaining]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDecision = (text: string, impact: 'low' | 'medium' | 'high', nextStepId: string, consequence: string) => {
    addDecision(text, impact);
    setCurrentStepId(nextStepId);
    
    toast({
      title: "Decision Made",
      description: consequence,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Score and Timer Display */}
        <div className="flex justify-between items-center">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
            Score: {totalScore}
          </div>
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-mono text-xl">
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg animate-in fade-in-50 duration-300">
                  <p className="text-lg font-medium">
                    {currentStep?.description}
                  </p>
                </div>
                
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Decision History</h3>
                  <div className="space-y-2">
                    {decisions.map((decision) => (
                      <div
                        key={decision.id}
                        className="p-4 bg-muted rounded-lg space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <span>{decision.decision}</span>
                          <span className={`px-2 py-1 rounded text-sm ${
                            decision.impact === 'high' ? 'bg-red-100 text-red-700' :
                            decision.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {decision.impact} impact
                          </span>
                        </div>
                        {decision.consequence && (
                          <p className="text-sm text-muted-foreground">
                            Consequence: {decision.consequence}
                          </p>
                        )}
                        <p className="text-sm text-primary">
                          Score: +{decision.score} points
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decision Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Decision Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Choose your next action carefully. Your decision will affect how the situation develops.
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
