
import { ScenarioDefinition } from '../types';

export const productRecallScenario: ScenarioDefinition = {
  id: 'reputation-2',
  category: 'reputation',
  inbrief: {
    title: "Global Product Recall Crisis",
    summary: "A critical safety defect has been discovered in your flagship product line, requiring an immediate global recall affecting millions of units.",
    objectives: [
      "Initiate recall procedure",
      "Notify affected customers",
      "Manage media communications",
      "Handle regulatory compliance",
      "Address safety concerns"
    ],
    stakeholders: [
      "Product Safety Team",
      "PR Department",
      "Legal Team",
      "Distribution Network",
      "Customer Service"
    ],
    resources: [
      "Recall Protocol",
      "Customer Database",
      "Safety Reports",
      "Media Relations",
      "Service Centers"
    ],
    initialSituation: "A critical safety defect has been confirmed in your best-selling product line. Early reports indicate potential fire hazards in 2.3 million units worldwide. Social media is already buzzing with videos of product failures, and major news outlets are preparing coverage."
  },
  steps: [
    {
      id: 'start',
      description: "The safety issue has been confirmed and media inquiries are flooding in. You need to act quickly to protect customers and manage the crisis.",
      options: [
        {
          text: "Issue immediate recall notice",
          impact: "high",
          nextStepId: "recall-notice",
          consequence: "Quick response protects customers but could panic markets.",
          requiresFollowUp: {
            question: "Draft the initial recall announcement:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Conduct additional testing",
          impact: "medium",
          nextStepId: "testing",
          consequence: "More data gathered but delays public response.",
          requiresFollowUp: {
            question: "What specific tests will you prioritize?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Brief key stakeholders",
          impact: "high",
          nextStepId: "stakeholder-brief",
          consequence: "Aligned response but increases information leak risk.",
          requiresFollowUp: {
            question: "List the key points for the stakeholder briefing:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
