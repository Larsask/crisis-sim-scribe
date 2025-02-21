
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, UserCircle } from 'lucide-react';

interface CrisisEvent {
  id: string;
  type: 'event' | 'decision' | 'consequence' | 'system';
  content: string;
  timestamp: number;
  parentId?: string;
  status: 'active' | 'resolved' | 'escalated';
}

interface CrisisResponseFlowProps {
  events: CrisisEvent[];
  timeRemaining: number;
}

export const CrisisResponseFlow = ({ events, timeRemaining }: CrisisResponseFlowProps) => {
  const getNodeIcon = (type: string, status: string) => {
    if (status === 'resolved') return <CheckCircle className="h-5 w-5 text-green-500" />;
    
    switch (type) {
      case 'event':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'decision':
        return <UserCircle className="h-5 w-5 text-purple-500" />;
      case 'consequence':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  // Organize events into a hierarchical structure
  const organizeEvents = (events: CrisisEvent[]) => {
    const eventMap = new Map<string | undefined, CrisisEvent[]>();
    
    events.forEach(event => {
      const parent = event.parentId || 'root';
      if (!eventMap.has(parent)) {
        eventMap.set(parent, []);
      }
      eventMap.get(parent)!.push(event);
    });

    return eventMap;
  };

  const renderEventNode = (event: CrisisEvent, level: number = 0) => {
    const organized = organizeEvents(events);
    const children = organized.get(event.id) || [];

    return (
      <div key={event.id} className="relative">
        <div className={`
          ml-${level * 4} p-3 rounded-lg shadow-sm mb-2
          ${event.status === 'resolved' ? 'bg-green-50 dark:bg-green-900/20' :
            event.status === 'escalated' ? 'bg-red-50 dark:bg-red-900/20' :
            event.type === 'system' ? 'bg-gray-50 dark:bg-gray-900/20' :
            'bg-blue-50 dark:bg-blue-900/20'}
          ${level > 0 ? 'border-l-2 border-gray-200 dark:border-gray-700' : ''}
        `}>
          <div className="flex items-center gap-2">
            {getNodeIcon(event.type, event.status)}
            <span className="text-sm">{event.content}</span>
          </div>
        </div>
        
        {children.length > 0 && (
          <div className="ml-4 space-y-2">
            {children.map(child => renderEventNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const organizedEvents = organizeEvents(events);
  const rootEvents = organizedEvents.get('root') || [];

  return (
    <Card className="p-4 overflow-auto max-h-[600px]">
      <h2 className="font-semibold text-lg mb-4">Crisis Response Flow</h2>
      <div className="space-y-4">
        {rootEvents.map(event => renderEventNode(event))}
      </div>
    </Card>
  );
};
