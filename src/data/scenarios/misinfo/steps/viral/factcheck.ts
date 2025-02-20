
import { ScenarioStep } from '../../../types';

export const factCheckStep: ScenarioStep = {
  id: 'fact-check',
  description: "Fact-checkers are reviewing your claims. You need to prepare for potential backlash if they find discrepancies.",
  options: [
    {
      text: "Prepare a detailed response plan",
      impact: "high",
      nextStepId: "response-plan",
      consequence: "Being proactive can mitigate damage but requires resources.",
      requiresFollowUp: {
        question: "What key points will your response cover?",
        type: "text",
        validation: "length:200"
      }
    },
    {
      text: "Wait for their findings before responding",
      impact: "medium",
      nextStepId: "wait-findings",
      consequence: "Allows for accurate information but risks losing control of the narrative.",
      requiresFollowUp: {
        question: "How will you monitor their progress?",
        type: "text",
        validation: "length:150"
      }
    },
    {
      text: "Discredit the fact-checkers",
      impact: "high",
      nextStepId: "discredit",
      consequence: "Could rally support but may backfire if not handled carefully.",
      requiresFollowUp: {
        question: "What evidence will you use to discredit them?",
        type: "text",
        validation: "length:200"
      }
    }
  ],
  timeLimit: 240
};
