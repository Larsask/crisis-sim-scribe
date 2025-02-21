
import { useEffect, useState, useRef } from 'react';
import { X, MessageCircle, Clock, Mail, Phone, AlertTriangle, Info } from 'lucide-react';
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
  type: 'email' | 'text' | 'call';
  status: 'unread' | 'read' | 'responded' | 'dismissed';
  responseOptions?: {
    text: string;
    impact: 'positive' | 'neutral' | 'negative';
  }[];
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
  const [dismissTimers, setDismissTimers] = useState<{[key: string]: NodeJS.Timeout}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [unreadMessages, setUnreadMessages] = useState<Set<string>>(new Set());

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Mark new messages as unread
    const newMessageIds = messages
      .filter(msg => !unreadMessages.has(msg.id))
      .map(msg => msg.id);
    
    if (newMessageIds.length > 0) {
      setUnreadMessages(prev => new Set([...prev, ...newMessageIds]));
      scrollToBottom();
    }
  }, [messages, unreadMessages]);

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

  const handleDismiss = (messageId: string) => {
    const timer = setTimeout(() => {
      onDismiss(messageId);
    }, 120000);

    setDismissTimers(prev => ({
      ...prev,
      [messageId]: timer
    }));
    
    // Remove from unread messages when dismissed
    setUnreadMessages(prev => {
      const next = new Set(prev);
      next.delete(messageId);
      return next;
    });
  };

  const handleResponse = (messageId: string, response: string) => {
    cancelDismissTimer(messageId);
    onRespond(messageId, response);
    
    // Remove from unread messages when responded to
    setUnreadMessages(prev => {
      const next = new Set(prev);
      next.delete(messageId);
      return next;
    });
  };

  const cancelDismissTimer = (messageId: string) => {
    if (dismissTimers[messageId]) {
      clearTimeout(dismissTimers[messageId]);
      setDismissTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[messageId];
        return newTimers;
      });
    }
  };

  const getMessageIcon = (type: 'email' | 'text' | 'call', urgency: 'normal' | 'urgent' | 'critical') => {
    const iconProps = {
      className: `h-5 w-5 ${
        urgency === 'critical' ? 'text-red-500' :
        urgency === 'urgent' ? 'text-yellow-500' :
        'text-blue-500'
      }`
    };

    switch (type) {
      case 'email':
        return <Mail {...iconProps} />;
      case 'call':
        return <Phone {...iconProps} />;
      default:
        return <MessageCircle {...iconProps} />;
    }
  };

  const getQuickResponses = (message: Message) => {
    if (message.sender === "Crisis Management Team") {
      return [
        { text: "We are aware. Stay the course.", impact: 'positive' },
        { text: "Re-evaluate the approach.", impact: 'neutral' },
        { text: "What specifically is the concern?", impact: 'neutral' }
      ];
    } else if (message.sender === "Press Office") {
      return [
        { text: "Prepare a statement.", impact: 'positive' },
        { text: "Monitor the situation.", impact: 'neutral' },
        { text: "Schedule a press briefing.", impact: 'positive' }
      ];
    }
    return message.responseOptions || [];
  };

  const formatTimeLeft = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto rounded-lg">
      {messages.map((message) => (
        <Card 
          key={message.id} 
          className={`p-4 transition-all duration-300 ${
            unreadMessages.has(message.id) ? 'animate-in fade-in slide-in-from-right-5' : ''
          } ${
            message.urgency === 'critical' ? 'border-red-500 bg-white shadow-lg' :
            message.urgency === 'urgent' ? 'border-yellow-500 bg-white shadow-md' :
            'bg-white shadow'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {getMessageIcon(message.type, message.urgency)}
              <span className="font-medium">{message.sender}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDismiss(message.id)}
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
            <div className="space-y-1 mb-2">
              {getQuickResponses(message).map((option, index) => (
                <Button
                  key={index}
                  variant={option.impact === 'positive' ? 'default' : option.impact === 'negative' ? 'destructive' : 'outline'}
                  size="sm"
                  className="w-full text-left justify-start"
                  onClick={() => handleResponse(message.id, option.text)}
                >
                  {option.text}
                </Button>
              ))}
            </div>
            
            <Textarea
              value={responses[message.id] || ''}
              onChange={(e) => {
                setResponses(prev => ({
                  ...prev,
                  [message.id]: e.target.value
                }));
                cancelDismissTimer(message.id);
              }}
              placeholder="Type your response..."
              className="text-sm"
            />
            <Button
              size="sm"
              className="w-full"
              onClick={() => {
                if (responses[message.id]) {
                  handleResponse(message.id, responses[message.id]);
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
      <div ref={messagesEndRef} />
    </div>
  );
};
