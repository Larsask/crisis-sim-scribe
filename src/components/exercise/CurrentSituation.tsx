
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Send, AlertTriangle, Info } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Current Situation</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBrief(!showBrief)}
            >
              {showBrief ? 'Hide Brief' : 'Show Brief'}
            </Button>
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
        </div>

        {showBrief && (
          <div className="mb-6 p-4 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2">{scenarioBrief.title}</h3>
            <p className="text-sm mb-4">{scenarioBrief.description}</p>
            <div className="flex items-start gap-2 p-2 bg-muted rounded">
              <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm">{scenarioBrief.initialSituation}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Available Actions</h3>
            <div className="grid gap-2">
              {availableOptions.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-3 px-4"
                  onClick={() => onDecision(option.text, false)}
                >
                  <div>
                    <div className="font-medium">{option.text}</div>
                    {option.consequence && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {option.consequence}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Custom Response</h3>
            <Textarea
              value={customResponse}
              onChange={(e) => setCustomResponse(e.target.value)}
              placeholder="Type your response to the situation..."
              className="min-h-[100px]"
            />
            <Button
              className="w-full"
              onClick={() => {
                if (customResponse.trim()) {
                  onDecision(customResponse, true);
                  setCustomResponse('');
                }
              }}
              disabled={!customResponse.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Response
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
