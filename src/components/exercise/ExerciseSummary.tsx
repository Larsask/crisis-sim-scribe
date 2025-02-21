
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

interface Decision {
  id: string;
  timestamp: number;
  decision: string;
  impact: 'low' | 'medium' | 'high';
  consequence?: string;
  followUpResponse?: string;
}

interface ExerciseSummaryProps {
  scenarioTitle: string;
  duration: string;
  decisions: Decision[];
  questionnaire: {
    situationHandling: string;
    lessonsLearned: string;
    keyTakeaways: string[];
  };
}

export const ExerciseSummary = ({ 
  scenarioTitle, 
  duration, 
  decisions,
  questionnaire 
}: ExerciseSummaryProps) => {
  const navigate = useNavigate();

  const impactCounts = decisions.reduce((acc, decision) => {
    acc[decision.impact] = (acc[decision.impact] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Exercise Summary: {scenarioTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Exercise Overview</h3>
              <p>Duration: {duration}</p>
              <p>Total Decisions Made: {decisions.length}</p>
              <div className="mt-2">
                <p>Impact Distribution:</p>
                <ul className="list-disc pl-6">
                  <li>High Impact Decisions: {impactCounts.high || 0}</li>
                  <li>Medium Impact Decisions: {impactCounts.medium || 0}</li>
                  <li>Low Impact Decisions: {impactCounts.low || 0}</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Key Decisions Timeline</h3>
              <div className="space-y-4">
                {decisions.map((decision) => (
                  <div 
                    key={decision.id} 
                    className={`p-4 rounded-lg ${
                      decision.impact === 'high' ? 'bg-red-50 dark:bg-red-900/20' :
                      decision.impact === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                      'bg-green-50 dark:bg-green-900/20'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{decision.decision}</span>
                      <span className="text-sm text-muted-foreground">
                        Impact: {decision.impact}
                      </span>
                    </div>
                    {decision.consequence && (
                      <p className="text-sm text-muted-foreground mt-1">{decision.consequence}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Reflection</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Situation Handling</h4>
                  <p className="text-muted-foreground">{questionnaire.situationHandling}</p>
                </div>
                <div>
                  <h4 className="font-medium">Lessons Learned</h4>
                  <p className="text-muted-foreground">{questionnaire.lessonsLearned}</p>
                </div>
                <div>
                  <h4 className="font-medium">Key Takeaways</h4>
                  <ul className="list-disc pl-6">
                    {questionnaire.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="text-muted-foreground">{takeaway}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={() => navigate('/scenario-setup')}>
          Start New Exercise
        </Button>
      </div>
    </div>
  );
};
