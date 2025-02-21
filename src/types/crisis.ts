
export interface CrisisEvent {
  id: string;
  type: 'stakeholder' | 'media' | 'internal' | 'government' | 'competitor' | 'event' | 'decision' | 'consequence' | 'system' | 'time-update' | 'escalation';
  content: string;
  timestamp: number;
  parentEventId?: string;
  status: 'active' | 'resolved' | 'escalated';
  source?: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface StakeholderMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  image?: string;
  urgency: 'normal' | 'urgent' | 'critical';
  responseDeadline?: number;
  type: 'email' | 'text' | 'call';
  status: 'unread' | 'read' | 'responded' | 'dismissed';
  responseOptions?: {
    text: string;
    impact: 'positive' | 'neutral' | 'negative';
  }[];
}

export interface DecisionOption {
  id: string;
  text: string;
  impact: 'low' | 'medium' | 'high';
  consequence: string;
  requiresFollowUp?: {
    question: string;
    type: 'text' | 'phone' | 'email' | 'time';
    validation?: string;
  };
}

export interface ScenarioBrief {
  title: string;
  description: string;
  initialSituation: string;
}
