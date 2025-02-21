
import { CrisisEvent } from '@/types/crisis';
import { aiService } from '@/services/ai-service';

export const generateDynamicUpdates = async (
  decision: string | null,
  crisisState: any,
  pastEvents: CrisisEvent[]
): Promise<CrisisEvent[]> => {
  const updates: CrisisEvent[] = [];
  
  // Generate media reactions
  if (decision) {
    const mediaReaction = await aiService.generateMediaReaction(decision, crisisState);
    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'event',
      content: mediaReaction,
      timestamp: Date.now() + 2000, // Slight delay for realism
      status: 'active',
      severity: crisisState.severity
    });
  }

  // Generate stakeholder responses
  const stakeholderUpdate = await aiService.generateStakeholderUpdate(crisisState, pastEvents);
  if (stakeholderUpdate) {
    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'event',
      content: stakeholderUpdate,
      timestamp: Date.now() + 5000,
      status: 'active',
      severity: crisisState.severity
    });
  }

  // Add crisis escalation if needed
  if (crisisState.publicTrust < 30 || crisisState.mediaAttention > 80) {
    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'event',
      content: 'Crisis situation is escalating rapidly. Immediate action required.',
      timestamp: Date.now() + 1000,
      status: 'escalated',
      severity: 'high'
    });
  }

  return updates;
};

const shouldTriggerJournalistCall = (crisisState: any, events: CrisisEvent[]): boolean => {
  const hasHighSeverityEvents = events.some(e => e.severity === 'high');
  const hasRecentDecisions = events
    .filter(e => e.type === 'decision')
    .some(e => Date.now() - e.timestamp < 300000); // Last 5 minutes

  return (
    hasHighSeverityEvents ||
    crisisState.mediaAttention > 70 ||
    (hasRecentDecisions && Math.random() > 0.7)
  );
};
