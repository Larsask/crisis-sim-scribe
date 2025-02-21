
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from 'lucide-react';

interface DecisionOption {
  id: string;
  text: string;
  impact: 'low' | 'medium' | 'high';
  consequence: string;
}

interface DecisionAreaProps {
  options: DecisionOption[];
  onDecisionMade: (decision: string, isCustom: boolean) => void;
}

export const DecisionArea = ({ options, onDecisionMade }: DecisionAreaProps) => {
  const [customDecision, setCustomDecision] = useState('');

  const handleCustomDecision = () => {
    if (customDecision.trim()) {
      onDecisionMade(customDecision, true);
      setCustomDecision('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-4">
        <h2 className="font-semibold text-lg mb-4">Make a Decision</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            {options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="w-full text-left justify-start h-auto py-3 px-4"
                onClick={() => onDecisionMade(option.text, false)}
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

          <div className="space-y-2">
            <Textarea
              placeholder="Type your own response..."
              value={customDecision}
              onChange={(e) => setCustomDecision(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              className="w-full"
              onClick={handleCustomDecision}
              disabled={!customDecision.trim()}
            >
              <SendHorizontal className="mr-2 h-4 w-4" />
              Send Custom Response
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
