
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Users, FileText, Send, AlertTriangle } from 'lucide-react';
import { DecisionOption } from '@/types/crisis';

interface StrategicPlanningProps {
  options: DecisionOption[];
  onDecision: (text: string, isCustom: boolean) => void;
  currentSeverity: 'low' | 'medium' | 'high';
}

export const StrategicPlanning = ({
  options,
  onDecision,
  currentSeverity
}: StrategicPlanningProps) => {
  const [customResponse, setCustomResponse] = useState('');
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);

  const handleOptionSelect = (option: DecisionOption) => {
    setSelectedOption(option);
    if (!option.requiresFollowUp) {
      onDecision(option.text, false);
    }
  };

  const handleCustomSubmit = () => {
    if (customResponse.trim()) {
      onDecision(customResponse, true);
      setCustomResponse('');
      setSelectedOption(null);
    }
  };

  return (
    <Card className="border-t-4 border-t-primary">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Crisis Management Team</h3>
          {currentSeverity === 'high' && (
            <AlertTriangle className="h-5 w-5 text-red-500 ml-auto" />
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            {options.map((option) => (
              <Button
                key={option.id}
                variant={option === selectedOption ? 'default' : 'outline'}
                className="w-full text-left justify-start h-auto py-3 px-4"
                onClick={() => handleOptionSelect(option)}
              >
                <div>
                  <p>{option.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Impact: {option.impact} - {option.consequence}
                  </p>
                </div>
              </Button>
            ))}
          </div>

          {selectedOption?.requiresFollowUp && (
            <div className="space-y-2 bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">
                {selectedOption.requiresFollowUp.question}
              </p>
              <Textarea
                value={customResponse}
                onChange={(e) => setCustomResponse(e.target.value)}
                placeholder="Type your response..."
                className="min-h-[100px]"
              />
              <Button
                className="w-full"
                onClick={handleCustomSubmit}
                disabled={!customResponse.trim()}
              >
                <FileText className="h-4 w-4 mr-2" />
                Submit Detailed Response
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">Or provide a custom strategy:</p>
            <Textarea
              value={customResponse}
              onChange={(e) => setCustomResponse(e.target.value)}
              placeholder="Outline your custom approach..."
              className="min-h-[100px]"
            />
            <Button
              className="w-full"
              onClick={handleCustomSubmit}
              disabled={!customResponse.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Custom Strategy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
