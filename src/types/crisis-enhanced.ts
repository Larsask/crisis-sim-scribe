
export interface TimeBasedEvent {
  triggerTime: number; // in milliseconds from start
  type: 'media' | 'stakeholder' | 'internal' | 'government' | 'competitor';
  content: string;
  severity: 'low' | 'medium' | 'high';
  requiresResponse: boolean;
  options?: {
    text: string;
    impact: 'positive' | 'neutral' | 'negative';
    consequence: string;
  }[];
}

export interface AIResponse {
  mainResponse: string;
  consequences: string[];
  stakeholderReactions: {
    group: string;
    reaction: string;
    urgency: 'normal' | 'urgent' | 'critical';
  }[];
  suggestedActions: {
    text: string;
    impact: 'low' | 'medium' | 'high';
    consequence: string;
  }[];
}

export interface CallState {
  isActive: boolean;
  isConnecting: boolean;
  hasVoiceFailed: boolean;
  currentSpeaker: string;
  transcript: string[];
}

export interface FollowUpMessage {
  type: 'decision_recap' | 'crisis_update' | 'stakeholder_message';
  title: string;
  content: string;
  options?: {
    text: string;
    consequence: string;
  }[];
  deadline?: number;
  urgency: 'normal' | 'urgent' | 'critical';
}
