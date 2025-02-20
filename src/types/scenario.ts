
export type DecisionImpact = 'low' | 'medium' | 'high';

export interface ScenarioInbrief {
  title: string;
  summary: string;
  objectives: string[];
  stakeholders: string[];
  resources: string[];
  initialSituation: string;
}

export interface ScenarioOption {
  text: string;
  impact: DecisionImpact;
  nextStepId: string;
  consequence: string;
  requiresFollowUp?: {
    question: string;
    type: 'text' | 'phone' | 'email' | 'time';
    validation?: string;
  };
}

export interface ScenarioStep {
  id: string;
  description: string;
  options: ScenarioOption[];
  timeLimit?: number; // in seconds
  isJournalistCall?: boolean;
  requiresStatement?: boolean;
  aiEscalation?: string[];
}

export interface ScenarioDefinition {
  id: string;
  category: string;
  inbrief: ScenarioInbrief;
  steps: ScenarioStep[];
}
