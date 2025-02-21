
import { useState, useEffect } from 'react';
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
  const [followUpResponse, setFollowUpResponse] = useState('');
  const [currentFollowUp, setCurrentFollowUp] = useState<{
    question: string;
    type: string;
    validation?: string;
  } | null>(null);

  const handleCustomResponse = () => {
    if (customResponse.trim()) {
      onDecision(customResponse, true);
      setCustomResponse('');
    }
  };

  const handleOptionSelected = (option: DecisionOption) => {
    onDecision(option.text, false);
    if (option.requiresFollowUp) {
      setCurrentFollowUp(option.requiresFollowUp);
    }
  };

  const handleFollowUpSubmit = () => {
    if (followUpResponse.trim()) {
      onDecision(`Follow-up: ${followUpResponse}`, true);
      setFollowUpResponse('');
      setCurrentFollowUp(null);
    }
  };

  return (
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
          <p className="text-sm mt-4 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
            {scenarioBrief.initialSituation}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {currentFollowUp ? (
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4" />
              Follow-up Required
            </h3>
            <p className="text-sm">{currentFollowUp.question}</p>
            <Textarea
              value={followUpResponse}
              onChange={(e) => setFollowUpResponse(e.target.value)}
              placeholder="Type your follow-up response..."
              className="min-h-[100px]"
            />
            <Button
              className="w-full"
              onClick={handleFollowUpSubmit}
              disabled={!followUpResponse.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Follow-up
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Suggested Actions</h3>
              <div className="space-y-2">
                {availableOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="w-full text-left justify-start h-auto py-3 px-4"
                    onClick={() => handleOptionSelected(option)}
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
          </>
        )}
      </div>
    </Card>
  );
};
