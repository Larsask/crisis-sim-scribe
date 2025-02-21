
export interface TimeBasedEvent {
  triggerTime: number;
  type: 'stakeholder' | 'media' | 'internal' | 'government' | 'competitor' | 'event' | 'decision' | 'consequence' | 'system' | 'time-update' | 'escalation';
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

export interface ExerciseConfig {
  timeBasedEvents: {
    frequency: 'low' | 'medium' | 'high';
    intensity: 'gradual' | 'intense';
    categories: ('media' | 'stakeholder' | 'internal' | 'government' | 'competitor')[];
  };
  aiResponses: {
    style: 'concise' | 'detailed' | 'analytical';
    tone: 'formal' | 'neutral' | 'urgent';
    includeSuggestions: boolean;
  };
  voiceSettings: {
    enabled: boolean;
    voice: 'alloy' | 'echo' | 'onyx' | 'nova' | 'shimmer';
    autoPlayAudio: boolean;
    transcribeResponses: boolean;
  };
}
