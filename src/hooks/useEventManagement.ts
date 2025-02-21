
import { useState } from 'react';
import { CrisisEvent } from '@/types/crisis';
import { crisisMemoryManager } from '@/utils/crisis-memory';

export const useEventManagement = () => {
  const [events, setEvents] = useState<CrisisEvent[]>([]);

  const addEvent = (event: CrisisEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const addEvents = (newEvents: CrisisEvent[]) => {
    setEvents(prev => [...prev, ...newEvents]);
  };

  const handleDecisionEvent = (text: string, severity: 'low' | 'medium' | 'high') => {
    const newEvents: CrisisEvent[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'decision',
        content: text,
        timestamp: Date.now(),
        status: severity === 'high' ? 'escalated' : 'active',
        severity
      }
    ];

    if (crisisMemoryManager.shouldEscalate(newEvents[0])) {
      const crisisState = crisisMemoryManager.getCrisisState();
      newEvents.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'consequence',
        content: `Situation has escalated. Public trust: ${crisisState.publicTrust}%`,
        timestamp: Date.now() + 1000,
        parentEventId: newEvents[0].id,
        status: 'escalated',
        severity: 'high'
      });
    }

    addEvents(newEvents);
    return newEvents;
  };

  return {
    events,
    addEvent,
    addEvents,
    handleDecisionEvent
  };
};
