
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
  
  // Calculate number of events to generate based on crisis severity and time skipped
  const numEvents = timeSkipped ? 
    (crisisState.severity === 'high' ? 4 : 3) : 
    (Math.random() > 0.7 ? 1 : 0);

  // Generate base events
  for(let i = 0; i < numEvents; i++) {
    const eventTypes = ['media', 'stakeholder', 'internal', 'regulatory'];
    const selectedType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    // Generate event content based on type
    let content;
    let severity;
    
    if (selectedType === 'media') {
      const headline = `AI Ethics Controversy Continues to Unfold`;
      const article = await aiService.generateNewsArticle({
        headline,
        context: `Recent actions: ${pastEvents.slice(-3).map(e => e.content).join('. ')}`,
        tone: crisisState.publicTrust < 50 ? 'critical' : 'neutral'
      });
      content = article;
      severity = 'high';
    } else {
      content = await aiService.generateStakeholderUpdate(crisisState, pastEvents);
      severity = crisisState.severity;
    }

    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: selectedType,
      content,
      timestamp: Date.now() + (i * 1000),
      status: severity === 'high' ? 'escalated' : 'active',
      severity
    });
  }

  // Add consequences for decisions
  if (decision) {
    const aiResponse = await aiService.generateResponse(decision, {
      pastDecisions: pastEvents.filter(e => e.type === 'decision').map(e => e.content),
      currentSeverity: crisisState.severity,
      stakeholderMood: crisisState.publicTrust < 50 ? 'negative' : 'neutral'
    });

    updates.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'consequence',
      content: aiResponse.mainResponse,
      timestamp: Date.now() + 1000,
      status: crisisState.severity === 'high' ? 'escalated' : 'active',
      severity: crisisState.severity
    });

    // Add stakeholder reactions
    aiResponse.stakeholderReactions.forEach((reaction, index) => {
      updates.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'stakeholder',
        content: `${reaction.group}: ${reaction.reaction}`,
        timestamp: Date.now() + (2000 + index * 1000),
        status: reaction.urgency === 'critical' ? 'escalated' : 'active',
        severity: reaction.urgency === 'critical' ? 'high' : 'medium'
      });
    });
  }

  return updates;
};

export const shouldTriggerJournalistCall = (
  crisisState: any, 
  events: CrisisEvent[],
  timeSkipped: boolean = false
): boolean => {
  const lastCallTime = events
    .filter(e => e.type === 'call')
    .sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp;

  const timeSinceLastCall = lastCallTime ? Date.now() - lastCallTime : Infinity;
  const hasHighSeverityEvents = events.some(e => e.severity === 'high');
  const minimumCallInterval = 5 * 60 * 1000; // 5 minutes

  return (
    (hasHighSeverityEvents && timeSinceLastCall > minimumCallInterval) ||
    (crisisState.mediaAttention > 70 && timeSinceLastCall > minimumCallInterval) ||
    (timeSkipped && Math.random() > 0.7 && timeSinceLastCall > minimumCallInterval)
  );
};

export const generateStakeholderMessage = (
  crisisState: any,
  events: CrisisEvent[]
): { type: 'email' | 'text'; content: string; urgency: 'normal' | 'urgent' | 'critical' } | null => {
  const recentEvents = events.slice(-5);
  const hasHighSeverity = recentEvents.some(e => e.severity === 'high');
  const hasUrgentMedia = recentEvents.some(e => e.type === 'media' && e.status === 'escalated');
  
  // Determine communication type based on urgency and past interactions
  const lastInteraction = events
    .filter(e => e.type === 'stakeholder')
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  const shouldUseEmail = hasHighSeverity || hasUrgentMedia;
  const type = shouldUseEmail ? 'email' : 'text';

  if (hasHighSeverity || hasUrgentMedia) {
    return {
      type,
      content: await aiService.generateStakeholderUpdate(crisisState, recentEvents),
      urgency: 'critical'
    };
  }

  if (crisisState.publicTrust < 50) {
    return {
      type,
      content: await aiService.generateStakeholderUpdate(crisisState, recentEvents),
      urgency: 'urgent'
    };
  }

  return {
    type: 'text',
    content: await aiService.generateStakeholderUpdate(crisisState, recentEvents),
    urgency: 'normal'
  };
};
