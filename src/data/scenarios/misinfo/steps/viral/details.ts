
import { ScenarioStep } from '../../../types';

export const detailedResultsStep: ScenarioStep = {
  id: 'detailed-results',
  description: "The detailed testing results have been shared. The media is now asking for a follow-up interview.",
  options: [
    {
      text: "Agree to the interview",
      impact: "high",
      nextStepId: "interview-agreed",
      consequence: "Opportunity to clarify but risks further scrutiny.",
      requiresFollowUp: {
        question: "Who will represent the company in the interview?",
        type: "text",
        validation: "length:100"
      }
    },
    {
      text: "Decline the interview",
      impact: "medium",
      nextStepId: "interview-declined",
      consequence: "Avoids risk but may appear evasive.",
      requiresFollowUp: {
        question: "How will you communicate this decision?",
        type: "text",
        validation: "length:150"
      }
    },
    {
      text: "Offer a written statement instead",
      impact: "medium",
      nextStepId: "written-statement",
      consequence: "Provides control over the message but lacks personal touch.",
      requiresFollowUp: {
        question: "What will the statement include?",
        type: "text",
        validation: "length:200"
      }
    }
  ],
  timeLimit: 180
};
