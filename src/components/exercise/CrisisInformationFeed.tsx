
import { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface CrisisUpdate {
  id: string;
  type: 'update' | 'stakeholder' | 'media' | 'internal';
  content: string;
  timestamp: number;
  severity: 'info' | 'warning' | 'critical';
  source?: string;
}

interface CrisisInformationFeedProps {
  updates: CrisisUpdate[];
}

export const CrisisInformationFeed = ({ updates }: CrisisInformationFeedProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [updates]);

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <ScrollArea className="h-[600px] w-full rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 space-y-4" ref={scrollRef}>
        <h2 className="font-semibold text-lg mb-4">Crisis Updates</h2>
        <div className="space-y-3">
          {updates.map((update) => (
            <div
              key={update.id}
              className={`p-3 rounded-lg animate-slide-in ${
                update.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/20' :
                update.severity === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                'bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {getIcon(update.severity)}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{update.source || 'System Update'}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(update.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{update.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};
