
import { useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';
import { CrisisEvent } from '@/types/crisis';
import { ScrollArea } from "@/components/ui/scroll-area";

interface CrisisResponseFlowProps {
  events: CrisisEvent[];
  timeRemaining: number;
}

export const CrisisResponseFlow = ({ events, timeRemaining }: CrisisResponseFlowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const getEventIcon = (type: string, severity: string = 'medium') => {
    const iconProps = {
      className: `h-5 w-5 ${
        severity === 'high' ? 'text-red-500' :
        severity === 'medium' ? 'text-yellow-500' :
        'text-blue-500'
      }`
    };

    switch (type) {
      case 'decision':
        return <CheckCircle {...iconProps} />;
      case 'consequence':
        return <AlertTriangle {...iconProps} />;
      case 'system':
        return <Info {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Crisis Timeline</h2>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <div className="space-y-4" ref={scrollRef}>
          {events.map((event, index) => (
            <Card
              key={event.id}
              className={`transition-all duration-300 ${
                index === events.length - 1 ? 'animate-in fade-in slide-in-from-bottom-5' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getEventIcon(event.type, event.severity)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm font-medium ${
                        event.severity === 'high' ? 'text-red-600' :
                        event.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{event.content}</p>
                    {event.status === 'escalated' && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                        Situation Escalating
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
