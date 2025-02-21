
export interface CrisisEvent {
  id: string;
  type: 'event' | 'decision' | 'consequence' | 'system';
  content: string;
  timestamp: number;
  parentId?: string;
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
}

export interface DecisionOption {
  id: string;
  text: string;
  impact: 'low' | 'medium' | 'high';
  consequence: string;
}

export interface ScenarioBrief {
  title: string;
  description: string;
  stakeholders: string[];
  objectives: string[];
  initialSituation: string;
}
