
import { ScenarioStep } from '../../../types';

export const initialStep: ScenarioStep = {
  id: 'start',
  description: "The hashtag #ProductSafety is trending, and a news network is preparing a prime-time story. Your PR team needs direction on the response strategy.",
  options: [
    {
      text: "Release comprehensive safety data",
      impact: "high",
      nextStepId: "safety-data",
      consequence: "Data published but technical nature may confuse public.",
      requiresFollowUp: {
        question: "How will you present the technical data in an accessible way?",
        type: "text",
        validation: "length:200"
      }
    },
    {
      text: "Launch counter-narrative campaign",
      impact: "medium",
      nextStepId: "counter-narrative",
      consequence: "Campaign starts but might fuel more controversy.",
      requiresFollowUp: {
        question: "Draft the key messages for your counter-narrative:",
        type: "text",
        validation: "length:250"
      }
    },
    {
      text: "Engage fact-checking organizations",
      impact: "high",
      nextStepId: "fact-check",
      consequence: "Fact-checkers engaged but verification takes time.",
      requiresFollowUp: {
        question: "What evidence will you provide to fact-checkers?",
        type: "text",
        validation: "length:200"
      }
    }
  ],
  timeLimit: 240
};
