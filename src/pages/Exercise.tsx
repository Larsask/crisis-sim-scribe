
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScenarioStore } from '@/store/scenarioStore';

const Exercise = () => {
  const navigate = useNavigate();
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
    decisions
  } = useScenarioStore();

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
      // Convert duration to milliseconds
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

  // Mock decision options based on scenario type
  const getDecisionOptions = () => {
    switch (category) {
      case 'cyberattack':
        return [
          { text: "Shut down affected systems immediately", impact: "high" },
          { text: "Isolate affected systems while maintaining critical services", impact: "medium" },
          { text: "Monitor and gather more information", impact: "low" }
        ];
      case 'misinformation':
        return [
          { text: "Issue immediate public statement", impact: "high" },
          { text: "Contact affected stakeholders privately", impact: "medium" },
          { text: "Monitor social media response", impact: "low" }
        ];
      default:
        return [
          { text: "Option A", impact: "high" },
          { text: "Option B", impact: "medium" },
          { text: "Option C", impact: "low" }
        ];
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Timer Display */}
        <div className="fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-mono text-xl">
          {formatTime(timeRemaining)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  You are facing a critical situation that requires immediate attention.
                  As the crisis manager, your decisions will impact the outcome.
                </p>
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Decision History</h3>
                  <div className="space-y-2">
                    {decisions.map((decision) => (
                      <div
                        key={decision.id}
                        className="p-3 bg-muted rounded-lg flex items-center justify-between"
                      >
                        <span>{decision.decision}</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          decision.impact === 'high' ? 'bg-red-100 text-red-700' :
                          decision.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {decision.impact} impact
                        </span>
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
                  Make decisions carefully. Each choice will affect the scenario's outcome.
                </p>
                <div className="space-y-2">
                  {getDecisionOptions().map((option, index) => (
                    <Button
                      key={index}
                      className="w-full"
                      variant="outline"
                      onClick={() => addDecision(option.text, option.impact as 'low' | 'medium' | 'high')}
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
