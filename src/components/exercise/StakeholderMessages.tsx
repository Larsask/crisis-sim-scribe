
import { useEffect, useState } from 'react';
import { X, MessageCircle, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  image?: string;
  urgency: 'normal' | 'urgent' | 'critical';
  responseDeadline?: number;
}

interface StakeholderMessagesProps {
  messages: Message[];
  onRespond: (messageId: string, response: string) => void;
  onDismiss: (messageId: string) => void;
}

export const StakeholderMessages = ({
  messages,
  onRespond,
  onDismiss
}: StakeholderMessagesProps) => {
  const [responses, setResponses] = useState<{[key: string]: string}>({});
  const [timeLeft, setTimeLeft] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const newTimeLeft: {[key: string]: number} = {};
      
      messages.forEach(msg => {
        if (msg.responseDeadline) {
          const remaining = Math.max(0, msg.responseDeadline - now);
          newTimeLeft[msg.id] = remaining;
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [messages]);

  const formatTimeLeft = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-4 max-w-sm z-50">
      {messages.map((message) => (
        <Card key={message.id} className="p-4 animate-slide-in">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <MessageCircle className={`h-5 w-5 ${
                message.urgency === 'critical' ? 'text-red-500' :
                message.urgency === 'urgent' ? 'text-yellow-500' :
                'text-blue-500'
              }`} />
              <span className="font-medium">{message.sender}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDismiss(message.id)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm mb-3">{message.content}</p>
          
          {message.image && (
            <img
              src={message.image}
              alt="Message attachment"
              className="w-full h-32 object-cover rounded-md mb-3"
            />
          )}

          {message.responseDeadline && timeLeft[message.id] > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span>Time remaining: {formatTimeLeft(timeLeft[message.id])}</span>
            </div>
          )}

          <div className="space-y-2">
            <Textarea
              value={responses[message.id] || ''}
              onChange={(e) => setResponses(prev => ({
                ...prev,
                [message.id]: e.target.value
              }))}
              placeholder="Type your response..."
              className="text-sm"
            />
            <Button
              size="sm"
              className="w-full"
              onClick={() => {
                if (responses[message.id]) {
                  onRespond(message.id, responses[message.id]);
                  setResponses(prev => ({...prev, [message.id]: ''}));
                }
              }}
              disabled={!responses[message.id]}
            >
              Respond
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
