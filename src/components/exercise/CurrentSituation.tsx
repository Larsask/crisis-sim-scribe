
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Send, AlertTriangle } from 'lucide-react';
import { DecisionOption, ScenarioBrief } from '@/types/crisis';

interface CurrentSituationProps {
  currentStepId: string;
  onDecision: (text: string, isCustom: boolean) => void;
  isTimeSkipping: boolean;
  onTimeSkip: () => void;
  scenarioBrief: ScenarioBrief;
  availableOptions: DecisionOption[];
}

export const CurrentSituation = ({
  currentStepId,
  onDecision,
  isTimeSkipping,
  onTimeSkip,
  scenarioBrief,
  availableOptions
}: CurrentSituationProps) => {
  const [customResponse, setCustomResponse] = useState('');
  const [showBrief, setShowBrief] = useState(true);

  useEffect(() => {
    // Hide brief after 30 seconds
    const timer = setTimeout(() => setShowBrief(false), 30000);
    return () => clearTimeout(timer);
  }, []);

  const handleCustomResponse = () => {
    if (customResponse.trim()) {
      onDecision(customResponse, true);
      setCustomResponse('');
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Current Situation</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onTimeSkip}
          disabled={isTimeSkipping}
        >
          <Clock className="mr-2 h-4 w-4" />
          Skip 5 Minutes
        </Button>
      </div>

      {isTimeSkipping && (
        <div className="mb-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="progress-bar h-full w-full" />
          </div>
        </div>
      )}

      {showBrief && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">{scenarioBrief.title}</h3>
          <p className="text-sm mb-4">{scenarioBrief.description}</p>
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-medium">Key Stakeholders:</h4>
              <ul className="text-sm list-disc list-inside">
                {scenarioBrief.stakeholders.map((stakeholder, index) => (
                  <li key={index}>{stakeholder}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium">Objectives:</h4>
              <ul className="text-sm list-disc list-inside">
                {scenarioBrief.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-sm mt-4 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
            {scenarioBrief.initialSituation}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">Suggested Actions</h3>
          <div className="space-y-2">
            {availableOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="w-full text-left justify-start h-auto py-3 px-4"
                onClick={() => onDecision(option.text, false)}
              >
                <div>
                  <div className="font-medium">{option.text}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Impact: {option.impact.charAt(0).toUpperCase() + option.impact.slice(1)}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">Your Custom Response</h3>
          <Textarea
            value={customResponse}
            onChange={(e) => setCustomResponse(e.target.value)}
            placeholder="Type your response to the situation..."
            className="min-h-[100px]"
          />
          <Button
            className="w-full"
            onClick={handleCustomResponse}
            disabled={!customResponse.trim()}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Response
          </Button>
        </div>
      </div>
    </Card>
  );
};
