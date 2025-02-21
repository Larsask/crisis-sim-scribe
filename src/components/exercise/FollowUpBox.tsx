
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, X, Send } from 'lucide-react';
import { FollowUpMessage } from '@/types/crisis-enhanced';

interface FollowUpBoxProps {
  message: FollowUpMessage;
  onResponse: (response: string) => void;
  onDismiss: () => void;
}

export const FollowUpBox = ({
  message,
  onResponse,
  onDismiss
}: FollowUpBoxProps) => {
  const [response, setResponse] = useState('');

  const handleSubmit = () => {
    if (response.trim()) {
      onResponse(response);
      setResponse('');
    }
  };

  return (
    <Card className="p-4 bg-white shadow-lg border-yellow-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium">{message.title}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm mb-4">{message.content}</p>

      {message.options && message.options.length > 0 && (
        <div className="space-y-2 mb-4">
          {message.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => onResponse(option.text)}
            >
              {option.text}
              {option.consequence && (
                <span className="text-xs text-muted-foreground ml-2">
                  ({option.consequence})
                </span>
              )}
            </Button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your response..."
          className="min-h-[100px]"
        />
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!response.trim()}
        >
          <Send className="mr-2 h-4 w-4" />
          Send Response
        </Button>
      </div>
    </Card>
  );
};
