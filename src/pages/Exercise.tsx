
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
    updateTimeRemaining
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
                {/* Event Feed will go here */}
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
                  <Button className="w-full" variant="outline">
                    Option A
                  </Button>
                  <Button className="w-full" variant="outline">
                    Option B
                  </Button>
                  <Button className="w-full" variant="outline">
                    Option C
                  </Button>
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
