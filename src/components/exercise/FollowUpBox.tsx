
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';
import { FollowUpMessage } from '@/types/crisis-enhanced';
import { Clock, AlertTriangle, Info } from 'lucide-react';

interface FollowUpBoxProps {
  message: FollowUpMessage;
  onResponse: (response: string) => void;
  onDismiss: () => void;
}

export const FollowUpBox = ({ message, onResponse, onDismiss }: FollowUpBoxProps) => {
  const [customResponse, setCustomResponse] = useState('');

  const getUrgencyIcon = () => {
    switch (message.urgency) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'urgent':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start gap-3">
        {getUrgencyIcon()}
        <div>
          <h3 className="font-semibold text-lg">{message.title}</h3>
          <p className="text-muted-foreground mt-1">{message.content}</p>
        </div>
      </div>

      {message.options && (
        <div className="space-y-2">
          {message.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full text-left justify-start h-auto py-3 px-4"
              onClick={() => onResponse(option.text)}
            >
              <div>
                <div className="font-medium">{option.text}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Consequence: {option.consequence}
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Textarea
          value={customResponse}
          onChange={(e) => setCustomResponse(e.target.value)}
          placeholder="Type your custom response..."
          className="min-h-[100px]"
        />
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => customResponse.trim() && onResponse(customResponse)}
            disabled={!customResponse.trim()}
          >
            Send Response
          </Button>
          <Button
            variant="outline"
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </Card>
  );
};
