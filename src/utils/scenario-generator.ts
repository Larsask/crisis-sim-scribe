
import { CrisisEvent } from '@/types/crisis';
import { aiService } from '@/services/ai-service';

export const generateDynamicUpdates = async (
  decision: string | null,
  crisisState: any,
  pastEvents: CrisisEvent[],
  timeSkipped: boolean = false
): Promise<CrisisEvent[]> => {
  const updates: CrisisEvent[] = [];
  
  // If time was skipped, generate a summary update
  if (timeSkipped) {
    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'time-update',
      content: "Time passes. The situation continues to develop...",
      timestamp: Date.now(),
      status: 'active',
      severity: crisisState.severity
    });

    // Add consequences for skipping time
    if (crisisState.mediaAttention > 50) {
      updates.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'consequence',
        content: "Media speculation intensifies due to lack of official response.",
        timestamp: Date.now() + 1000,
        status: 'escalated',
        severity: 'high'
      });
    }
  }

  // Generate media reactions for decisions
  if (decision) {
    const mediaReaction = await aiService.generateMediaReaction(decision, crisisState);
    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'event',
      content: mediaReaction,
      timestamp: Date.now() + 2000,
      status: 'active',
      severity: crisisState.severity
    });
  }

  // Generate stakeholder responses
  const stakeholderUpdate = await aiService.generateStakeholderUpdate(crisisState, pastEvents);
  if (stakeholderUpdate) {
    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'stakeholder',
      content: stakeholderUpdate,
      timestamp: Date.now() + 5000,
      status: 'active',
      severity: crisisState.severity
    });
  }

  // Crisis escalation logic
  if (crisisState.publicTrust < 30 || crisisState.mediaAttention > 80) {
    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'escalation',
      content: 'Crisis situation is escalating rapidly. Immediate action required.',
      timestamp: Date.now() + 1000,
      status: 'escalated',
      severity: 'high'
    });
  }

  return updates;
};

export const shouldTriggerJournalistCall = (
  crisisState: any, 
  events: CrisisEvent[],
  timeSkipped: boolean = false
): boolean => {
  const hasHighSeverityEvents = events.some(e => e.severity === 'high');
  const hasRecentDecisions = events
    .filter(e => e.type === 'decision')
    .some(e => Date.now() - e.timestamp < 300000); // Last 5 minutes

  // Increase likelihood of call after time skip
  const timeSkipMultiplier = timeSkipped ? 1.5 : 1;

  return (
    hasHighSeverityEvents ||
    (crisisState.mediaAttention * timeSkipMultiplier > 70) ||
    (hasRecentDecisions && Math.random() > 0.7)
  );
};

export const generateStakeholderMessage = (
  crisisState: any,
  events: CrisisEvent[]
): { type: 'email' | 'text'; content: string; urgency: 'normal' | 'urgent' | 'critical' } | null => {
  const lastEvent = events[events.length - 1];
  
  if (!lastEvent) return null;

  // Generate appropriate stakeholder response based on crisis state
  if (crisisState.publicTrust < 40) {
    return {
      type: 'email',
      content: 'Stakeholders are expressing serious concerns about the handling of this situation.',
      urgency: 'critical'
    };
  }

  if (lastEvent.type === 'decision') {
    return {
      type: 'text',
      content: 'Team members are requesting clarification on the recent decision.',
      urgency: 'urgent'
    };
  }

  return null;
};
