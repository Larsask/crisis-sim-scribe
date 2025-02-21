
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

class CrisisMemoryManager {
  private npcMemory: Map<string, NPCMemory> = new Map();
  private crisisState: CrisisState = {
    severity: 'low',
    publicTrust: 100,
    mediaAttention: 0,
    internalMorale: 100
  };

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

    // Update relationship status based on recent interactions
    memory.relationshipStatus = this.calculateRelationshipStatus(memory.pastInteractions);
    memory.lastInteraction = Date.now();

    this.npcMemory.set(sender, memory);
    this.updateCrisisState(sentiment);
  }

  generateResponse(sender: string, context: string): string {
    const memory = this.npcMemory.get(sender);
    if (!memory) return context;

    const recentInteractions = memory.pastInteractions
      .slice(-3)
      .map(i => i.response)
      .join(". ");

    const sentimentPattern = this.analyzeSentimentPattern(memory.pastInteractions);
    let modifier = "";

    switch (sentimentPattern) {
      case 'consistently_negative':
        modifier = "Given your previous responses, we require more concrete assurances. ";
        break;
      case 'improving':
        modifier = "We appreciate your recent cooperation. However, ";
        break;
      case 'deteriorating':
        modifier = "Our confidence is waning based on recent interactions. ";
        break;
      default:
        modifier = "";
    }

    return `${modifier}${context} (Previous interaction context: ${recentInteractions})`;
  }

  shouldEscalate(event: CrisisEvent): boolean {
    const currentSeverity = this.crisisState.severity;
    const lowTrust = this.crisisState.publicTrust < 50;
    const highAttention = this.crisisState.mediaAttention > 70;

    return (
      currentSeverity === 'high' ||
      (lowTrust && highAttention) ||
      this.crisisState.internalMorale < 40
    );
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

    // Update severity based on crisis state
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
