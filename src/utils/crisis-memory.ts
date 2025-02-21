import { StakeholderMessage, CrisisEvent } from '@/types/crisis';

interface StakeholderInteraction {
  messageId: string;
  response: string;
  timestamp: number;
  type: 'call' | 'text' | 'email';
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface StakeholderMemory {
  lastInteraction: number;
  interactionCount: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  preferredChannel: 'call' | 'email' | 'text';
  pastInteractions: StakeholderInteraction[];
  relationshipStatus: 'hostile' | 'neutral' | 'supportive';
  priority: 'high' | 'medium' | 'low';
  lastResponseTime: number;
  callsCooldown: number;
}

interface CrisisState {
  severity: 'low' | 'medium' | 'high';
  publicTrust: number;
  mediaAttention: number;
  internalMorale: number;
  timeElapsed: number;
  lastUpdate: number;
  availableActions: string[];
  usedActions: Set<string>;
}

class CrisisMemoryManager {
  private stakeholderMemory: Map<string, StakeholderMemory> = new Map();
  private crisisState: CrisisState = {
    severity: 'low',
    publicTrust: 100,
    mediaAttention: 0,
    internalMorale: 100,
    timeElapsed: 0,
    lastUpdate: Date.now(),
    availableActions: [
      'Monitor the situation',
      'Engage with stakeholders'
    ],
    usedActions: new Set()
  };

  updateStakeholderMemory(stakeholder: string, interaction: {
    type: 'call' | 'email' | 'text';
    response?: string;
    declined?: boolean;
    messageId: string;
  }): void {
    const memory = this.stakeholderMemory.get(stakeholder) || {
      lastInteraction: Date.now(),
      interactionCount: 0,
      sentiment: 'neutral',
      preferredChannel: 'email',
      pastInteractions: [],
      relationshipStatus: 'neutral',
      priority: 'medium',
      lastResponseTime: 0,
      callsCooldown: 0
    } as StakeholderMemory;

    memory.lastInteraction = Date.now();
    memory.interactionCount++;

    if (interaction.declined) {
      memory.sentiment = 'negative';
      memory.preferredChannel = 'email';
      memory.relationshipStatus = 'hostile';
      memory.callsCooldown = Date.now() + 10 * 60 * 1000; // 10 minute cooldown
    } else if (interaction.response) {
      const sentiment = this.analyzeSentiment(interaction.response);
      memory.sentiment = sentiment;
      memory.lastResponseTime = Date.now();

      memory.pastInteractions.push({
        messageId: interaction.messageId,
        response: interaction.response,
        timestamp: Date.now(),
        type: interaction.type,
        sentiment
      });

      const recentSentiments = memory.pastInteractions.slice(-3).map(i => i.sentiment);
      const positiveCount = recentSentiments.filter(s => s === 'positive').length;
      const negativeCount = recentSentiments.filter(s => s === 'negative').length;

      if (positiveCount >= 2) memory.relationshipStatus = 'supportive';
      else if (negativeCount >= 2) memory.relationshipStatus = 'hostile';
      else memory.relationshipStatus = 'neutral';
    }

    memory.priority = this.crisisState.severity === 'high' || memory.relationshipStatus === 'hostile' 
      ? 'high' 
      : memory.relationshipStatus === 'supportive' ? 'low' : 'medium';

    this.stakeholderMemory.set(stakeholder, memory);
  }

  shouldContactStakeholder(stakeholder: string): boolean {
    const memory = this.stakeholderMemory.get(stakeholder);
    if (!memory) return true;

    const timeSinceLastInteraction = Date.now() - memory.lastInteraction;
    const isInCooldown = Date.now() < memory.callsCooldown;
    const minInterval = memory.sentiment === 'negative' ? 3 * 60 * 1000 : 5 * 60 * 1000;

    return !isInCooldown && timeSinceLastInteraction > minInterval;
  }

  getNextAvailableActions(currentEvents: CrisisEvent[]): string[] {
    const baseActions = new Set(['Monitor the situation', 'Engage with stakeholders']);
    const dynamicActions = new Set<string>();

    if (this.crisisState.mediaAttention > 60) {
      dynamicActions.add('Issue a public statement');
      dynamicActions.add('Schedule a press conference');
    }

    if (this.crisisState.publicTrust < 50) {
      dynamicActions.add('Launch transparency initiative');
      dynamicActions.add('Engage external auditors');
    }

    if (this.crisisState.internalMorale < 70) {
      dynamicActions.add('Hold employee town hall');
      dynamicActions.add('Implement feedback system');
    }

    return [...baseActions, ...dynamicActions].filter(action => !this.crisisState.usedActions.has(action));
  }

  updateCrisisState(action: string, events: CrisisEvent[]): void {
    this.crisisState.usedActions.add(action);
    
    const impact = this.calculateActionImpact(action, events);
    this.crisisState.publicTrust = Math.max(0, Math.min(100, this.crisisState.publicTrust + impact.trust));
    this.crisisState.mediaAttention = Math.max(0, Math.min(100, this.crisisState.mediaAttention + impact.media));
    this.crisisState.internalMorale = Math.max(0, Math.min(100, this.crisisState.internalMorale + impact.morale));

    if (this.crisisState.publicTrust < 30 || this.crisisState.mediaAttention > 80) {
      this.crisisState.severity = 'high';
    } else if (this.crisisState.publicTrust < 60 || this.crisisState.mediaAttention > 50) {
      this.crisisState.severity = 'medium';
    } else {
      this.crisisState.severity = 'low';
    }
  }

  getCrisisState(): CrisisState {
    return { ...this.crisisState };
  }

  getStakeholderStatus(stakeholder: string): {
    lastInteraction: number;
    relationshipStatus: 'hostile' | 'neutral' | 'supportive';
    priority: 'high' | 'medium' | 'low';
    preferredChannel: 'call' | 'email' | 'text';
  } | undefined {
    const memory = this.stakeholderMemory.get(stakeholder);
    if (!memory) return undefined;

    return {
      lastInteraction: memory.lastInteraction,
      relationshipStatus: memory.relationshipStatus,
      priority: memory.priority,
      preferredChannel: memory.preferredChannel
    };
  }

  shouldEscalate(event: CrisisEvent): boolean {
    const recentEvents = this.getRecentEvents();
    const hasHighSeverityEvents = recentEvents.some(e => e.severity === 'high');
    return this.crisisState.severity === 'high' || hasHighSeverityEvents;
  }

  addInteraction(stakeholder: string, messageId: string, response: string): void {
    this.updateStakeholderMemory(stakeholder, {
      type: 'text',
      messageId,
      response
    });
  }

  getNPCStatus(stakeholder: string): {
    relationshipStatus: 'hostile' | 'neutral' | 'supportive';
  } | null {
    const memory = this.stakeholderMemory.get(stakeholder);
    if (!memory) return null;
    return {
      relationshipStatus: memory.relationshipStatus
    };
  }

  generateResponse(stakeholder: string, defaultResponse: string): string {
    const memory = this.stakeholderMemory.get(stakeholder);
    if (!memory) return defaultResponse;

    const relationship = memory.relationshipStatus;
    const recentInteractions = memory.pastInteractions.slice(-3);
    
    if (relationship === 'hostile') {
      return `${defaultResponse} We expect a more thorough response given recent developments.`;
    } else if (relationship === 'supportive') {
      return `${defaultResponse} We appreciate your continued cooperation.`;
    }
    return defaultResponse;
  }

  getStakeholderHistory(stakeholder: string): Array<{ type: string; content: string }> {
    const memory = this.stakeholderMemory.get(stakeholder);
    if (!memory) return [];

    return memory.pastInteractions.map(interaction => ({
      type: interaction.type,
      content: interaction.response
    }));
  }

  private getRecentEvents(): CrisisEvent[] {
    return [];
  }

  private calculateActionImpact(action: string, events: CrisisEvent[]) {
    const baseImpact = {
      trust: 0,
      media: 0,
      morale: 0
    };

    switch (action) {
      case 'Monitor the situation':
        baseImpact.trust -= 2;
        baseImpact.media += 5;
        break;
      case 'Engage with stakeholders':
        baseImpact.trust += 5;
        baseImpact.morale += 3;
        break;
      case 'Issue a public statement':
        baseImpact.trust += 10;
        baseImpact.media -= 5;
        break;
    }

    return baseImpact;
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['resolve', 'improve', 'address', 'help', 'support', 'transparent'];
    const negativeWords = ['deny', 'refuse', 'ignore', 'delay', 'hide', 'blame'];

    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));

    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative) return 'negative';
    return 'neutral';
  }
}

export const crisisMemoryManager = new CrisisMemoryManager();
