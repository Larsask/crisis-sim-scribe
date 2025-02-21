
import { CrisisEvent } from '@/types/crisis';
import { aiService } from '@/services/ai-service';
import { crisisMemoryManager } from '@/utils/crisis-memory';

export const generateDynamicUpdates = async (
  decision: string | null,
  crisisState: any,
  pastEvents: CrisisEvent[],
  timeSkipped: boolean = false
): Promise<CrisisEvent[]> => {
  const updates: CrisisEvent[] = [];
  
  if (timeSkipped) {
    const escalationEvents = [
      "A whistleblower has leaked internal documents to the press.",
      "Social media backlash is intensifying as the story spreads.",
      "Industry experts are publicly questioning company practices.",
      "Competitors are distancing themselves from similar AI technologies.",
      "Employee concerns about the situation are being shared online."
    ];

    // Add 1-2 escalation events when time is skipped
    const numEvents = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numEvents; i++) {
      const eventContent = escalationEvents[Math.floor(Math.random() * escalationEvents.length)];
      updates.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'media',
        content: eventContent,
        timestamp: Date.now() + (i * 1000),
        status: 'escalated',
        severity: 'high'
      });
    }
  }

  // Generate stakeholder responses based on crisis state
  if (crisisState.publicTrust < 50 || timeSkipped) {
    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'stakeholder',
      content: "Key stakeholders are demanding an emergency meeting to discuss the situation.",
      timestamp: Date.now() + 3000,
      status: 'active',
      severity: 'high'
    });
  }

  // Add media pressure if attention is high
  if (crisisState.mediaAttention > 70 || timeSkipped) {
    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'media',
      content: "Multiple news outlets are preparing in-depth coverage of the situation.",
      timestamp: Date.now() + 4000,
      status: 'escalated',
      severity: 'high'
    });
  }

  // Internal response to declining morale
  if (crisisState.internalMorale < 60 || timeSkipped) {
    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'internal',
      content: "Employee satisfaction metrics are declining. HR reports increasing concerns.",
      timestamp: Date.now() + 5000,
      status: 'active',
      severity: 'medium'
    });
  }

  return updates;
};

export const shouldTriggerJournalistCall = (
  crisisState: any, 
  events: CrisisEvent[],
  timeSkipped: boolean = false
): boolean => {
  const lastDecisionTime = events
    .filter(e => e.type === 'decision')
    .sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp;

  const timeSinceLastDecision = lastDecisionTime ? Date.now() - lastDecisionTime : Infinity;
  const hasHighSeverityEvents = events.some(e => e.severity === 'high');

  return (
    (hasHighSeverityEvents && timeSinceLastDecision > 60000) || // 1 minute after high severity event
    (crisisState.mediaAttention > 70) ||
    (timeSkipped && Math.random() > 0.5) // 50% chance after time skip
  );
};

export const generateStakeholderMessage = (
  crisisState: any,
  events: CrisisEvent[]
): { type: 'email' | 'text'; content: string; urgency: 'normal' | 'urgent' | 'critical' } | null => {
  const recentEvents = events.slice(-5);
  const hasHighSeverity = recentEvents.some(e => e.severity === 'high');
  const hasUrgentMedia = recentEvents.some(e => e.type === 'media' && e.status === 'escalated');

  if (hasHighSeverity || hasUrgentMedia) {
    return {
      type: 'email',
      content: "Urgent: Stakeholder committee requests immediate briefing on crisis developments.",
      urgency: 'critical'
    };
  }

  if (crisisState.publicTrust < 50) {
    return {
      type: 'email',
      content: "Public trust metrics are concerning. Please review attached stakeholder feedback.",
      urgency: 'urgent'
    };
  }

  return {
    type: 'text',
    content: "Team members are requesting guidance on external communications.",
    urgency: 'normal'
  };
};
