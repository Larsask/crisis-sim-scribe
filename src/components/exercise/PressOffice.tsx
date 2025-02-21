
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, AlertTriangle, Clock, Send } from 'lucide-react';
import { StakeholderMessage } from '@/types/crisis';

interface PressOfficeProps {
  messages: StakeholderMessage[];
  onRespond: (messageId: string, response: string) => void;
  onDismiss: (messageId: string) => void;
}

export const PressOffice = ({ messages, onRespond, onDismiss }: PressOfficeProps) => {
  const [responses, setResponses] = useState<{[key: string]: string}>({});

  const getTimeRemaining = (deadline: number) => {
    const remaining = deadline - Date.now();
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getUrgencyColor = (urgency: 'normal' | 'urgent' | 'critical') => {
    switch (urgency) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'urgent':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  const getQuickResponses = (message: StakeholderMessage) => {
    if (message.responseOptions) return message.responseOptions;

    const defaultResponses = [
      { text: "We are actively addressing this situation", impact: 'positive' },
      { text: "We'll provide more details shortly", impact: 'neutral' },
      { text: "Let me consult with the team", impact: 'neutral' }
    ];

    if (message.urgency === 'critical') {
      defaultResponses.unshift({ 
        text: "This is our top priority and we're taking immediate action", 
        impact: 'positive' 
      });
    }

    return defaultResponses;
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {messages.map((message) => (
        <Card 
          key={message.id}
          className={`transition-all duration-300 ${getUrgencyColor(message.urgency)}`}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Mail className={`h-5 w-5 ${
                  message.urgency === 'critical' ? 'text-red-500' :
                  message.urgency === 'urgent' ? 'text-yellow-500' :
                  'text-blue-500'
                }`} />
                <div>
                  <p className="font-medium">{message.sender}</p>
                  {message.responseDeadline && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Response needed: {getTimeRemaining(message.responseDeadline)}</span>
                    </div>
                  )}
                </div>
              </div>
              {message.urgency === 'critical' && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
            </div>

            <p className="text-sm mb-4">{message.content}</p>

            <div className="space-y-3">
              {getQuickResponses(message).map((option, index) => (
                <Button
                  key={index}
                  variant={option.impact === 'positive' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full text-left justify-start"
                  onClick={() => onRespond(message.id, option.text)}
                >
                  {option.text}
                </Button>
              ))}

              <div className="space-y-2">
                <Textarea
                  value={responses[message.id] || ''}
                  onChange={(e) => setResponses(prev => ({
                    ...prev,
                    [message.id]: e.target.value
                  }))}
                  placeholder="Type your custom response..."
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (responses[message.id]) {
                        onRespond(message.id, responses[message.id]);
                        setResponses(prev => ({...prev, [message.id]: ''}));
                      }
                    }}
                    disabled={!responses[message.id]}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onDismiss(message.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
