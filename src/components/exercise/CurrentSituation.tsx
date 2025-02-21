
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Send } from 'lucide-react';

interface CurrentSituationProps {
  currentStepId: string;
  onDecision: (text: string, isCustom: boolean) => void;
  isTimeSkipping: boolean;
  onTimeSkip: () => void;
}

export const CurrentSituation = ({
  currentStepId,
  onDecision,
  isTimeSkipping,
  onTimeSkip
}: CurrentSituationProps) => {
  const [customResponse, setCustomResponse] = useState('');

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

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">Your Response</h3>
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

        <div className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">Suggested Actions</h3>
          {/* Pre-set decision options would be mapped here */}
        </div>
      </div>
    </Card>
  );
};
