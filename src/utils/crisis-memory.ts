import { StakeholderMessage, CrisisEvent } from '@/types/crisis';

interface NPCMemory {
  pastInteractions: {
    messageId: string;
    response: string;
    timestamp: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  relationshipStatus: 'positive' | 'neutral' | 'negative';
  lastInteraction: number;
}

interface CrisisState {
  severity: 'low' | 'medium' | 'high';
  publicTrust: number;
  mediaAttention: number;
  internalMorale: number;
}

interface StakeholderMemory {
  lastInteraction: number;
  interactionCount: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  preferredChannel: 'call' | 'email' | 'text';
}

class CrisisMemoryManager {
  private npcMemory: Map<string, NPCMemory> = new Map();
  private crisisState: CrisisState = {
    severity: 'low',
    publicTrust: 100,
    mediaAttention: 0,
    internalMorale: 100
  };
  private stakeholderMemory: Map<string, StakeholderMemory> = new Map();

  addInteraction(sender: string, messageId: string, response: string) {
    const memory = this.npcMemory.get(sender) || {
      pastInteractions: [],
      relationshipStatus: 'neutral',
      lastInteraction: Date.now()
    };

    const sentiment = this.analyzeSentiment(response);
    memory.pastInteractions.push({
      messageId,
      response,
      timestamp: Date.now(),
      sentiment
    });

    memory.relationshipStatus = this.calculateRelationshipStatus(memory.pastInteractions);
    memory.lastInteraction = Date.now();

    this.npcMemory.set(sender, memory);
    this.updateCrisisState(sentiment);
  }

  updateStakeholderMemory(stakeholder: string, interaction: {
    type: 'call' | 'email' | 'text',
    response?: string,
    declined?: boolean
  }) {
    const memory = this.stakeholderMemory.get(stakeholder) || {
      lastInteraction: Date.now(),
      interactionCount: 0,
      sentiment: 'neutral',
      preferredChannel: 'email'
    };

    memory.lastInteraction = Date.now();
    memory.interactionCount++;

    if (interaction.declined) {
      memory.sentiment = 'negative';
      memory.preferredChannel = 'email';
    } else if (interaction.response) {
      const sentiment = this.analyzeSentiment(interaction.response);
      memory.sentiment = sentiment;
    }

    this.stakeholderMemory.set(stakeholder, memory);
  }

  shouldContactStakeholder(stakeholder: string): boolean {
    const memory = this.stakeholderMemory.get(stakeholder);
    if (!memory) return true;

    const timeSinceLastInteraction = Date.now() - memory.lastInteraction;
    const minInterval = memory.sentiment === 'negative' ? 3 * 60 * 1000 : 5 * 60 * 1000;

    return timeSinceLastInteraction > minInterval;
  }

  getPreferredChannel(stakeholder: string): 'call' | 'email' | 'text' {
    const memory = this.stakeholderMemory.get(stakeholder);
    return memory?.preferredChannel || 'email';
  }

  shouldEscalate(event: CrisisEvent): boolean {
    // Check if this event should trigger an escalation
    const isHighImpactDecision = event.type === 'decision' && (
      event.content.toLowerCase().includes('shutdown') ||
      event.content.toLowerCase().includes('immediate') ||
      event.content.toLowerCase().includes('emergency')
    );

    const isNegativeResponse = event.type === 'decision' && 
      this.analyzeSentiment(event.content) === 'negative';

    const isCriticalState = 
      this.crisisState.publicTrust < 40 || 
      this.crisisState.mediaAttention > 75;

    return isHighImpactDecision || isNegativeResponse || isCriticalState;
  }

  generateResponse(sender: string, baseResponse: string): string {
    const memory = this.npcMemory.get(sender);
    if (!memory) return baseResponse;

    const sentiment = memory.relationshipStatus;
    const pattern = this.analyzeSentimentPattern(memory.pastInteractions);

    // Modify response based on relationship and pattern
    if (pattern === 'consistently_negative') {
      return `${baseResponse} Your previous responses have not addressed our concerns adequately.`;
    } else if (pattern === 'improving') {
      return `${baseResponse} We appreciate your recent efforts to address the situation.`;
    } else if (pattern === 'deteriorating') {
      return `${baseResponse} Our confidence in your handling of this situation is declining.`;
    }

    return baseResponse;
  }

  private analyzeSentiment(response: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['resolve', 'improve', 'address', 'help', 'support', 'transparent'];
    const negativeWords = ['deny', 'refuse', 'ignore', 'delay', 'hide', 'blame'];

    const lowerResponse = response.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerResponse.includes(word));
    const hasNegative = negativeWords.some(word => lowerResponse.includes(word));

    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative) return 'negative';
    return 'neutral';
  }

  private analyzeSentimentPattern(interactions: NPCMemory['pastInteractions']): 'consistently_negative' | 'improving' | 'deteriorating' | 'neutral' {
    if (interactions.length < 3) return 'neutral';

    const recent = interactions.slice(-3);
    const sentiments = recent.map(i => i.sentiment);
    
    if (sentiments.every(s => s === 'negative')) return 'consistently_negative';
    if (sentiments[0] === 'negative' && sentiments[2] === 'positive') return 'improving';
    if (sentiments[0] === 'positive' && sentiments[2] === 'negative') return 'deteriorating';
    return 'neutral';
  }

  private calculateRelationshipStatus(interactions: NPCMemory['pastInteractions']): 'positive' | 'neutral' | 'negative' {
    const recentInteractions = interactions.slice(-5);
    const sentimentScore = recentInteractions.reduce((score, interaction) => {
      return score + (interaction.sentiment === 'positive' ? 1 : interaction.sentiment === 'negative' ? -1 : 0);
    }, 0);

    if (sentimentScore > 1) return 'positive';
    if (sentimentScore < -1) return 'negative';
    return 'neutral';
  }

  private updateCrisisState(sentiment: 'positive' | 'neutral' | 'negative') {
    const impact = sentiment === 'positive' ? 5 : sentiment === 'negative' ? -10 : -2;
    
    this.crisisState.publicTrust = Math.max(0, Math.min(100, this.crisisState.publicTrust + impact));
    this.crisisState.mediaAttention = Math.max(0, Math.min(100, this.crisisState.mediaAttention + (sentiment === 'negative' ? 15 : 5)));
    this.crisisState.internalMorale = Math.max(0, Math.min(100, this.crisisState.internalMorale + (impact / 2)));

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

  getNPCStatus(sender: string): NPCMemory | undefined {
    return this.npcMemory.get(sender);
  }

  getResponseUrgency(sender: string): 'normal' | 'urgent' | 'critical' {
    const memory = this.npcMemory.get(sender);
    if (!memory) return 'normal';

    const recentNegative = memory.pastInteractions
      .slice(-3)
      .filter(i => i.sentiment === 'negative')
      .length;

    if (recentNegative >= 2) return 'critical';
    if (recentNegative >= 1) return 'urgent';
    return 'normal';
  }
}

export const crisisMemoryManager = new CrisisMemoryManager();
