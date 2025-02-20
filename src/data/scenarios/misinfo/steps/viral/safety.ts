
import { ScenarioStep } from '../../../types';

export const safetyDataStep: ScenarioStep = {
  id: 'safety-data',
  description: "Your safety data has been released. The media is now asking for more details about the product's safety testing.",
  options: [
    {
      text: "Provide detailed testing results",
      impact: "high",
      nextStepId: "detailed-results",
      consequence: "Transparency builds trust but may reveal vulnerabilities.",
      requiresFollowUp: {
        question: "What specific results will you share?",
        type: "text",
        validation: "length:200"
      }
    },
    {
      text: "Limit information to general statements",
      impact: "medium",
      nextStepId: "general-statements",
      consequence: "Less detailed but avoids revealing sensitive information.",
      requiresFollowUp: {
        question: "What general statements will you make?",
        type: "text",
        validation: "length:150"
      }
    },
    {
      text: "Decline to comment further",
      impact: "low",
      nextStepId: "no-comment",
      consequence: "Avoids risk but may frustrate stakeholders.",
      requiresFollowUp: {
        question: "How will you communicate this decision?",
        type: "text",
        validation: "length:100"
      }
    }
  ],
  timeLimit: 180
};
