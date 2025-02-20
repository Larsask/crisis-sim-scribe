
import { ScenarioDefinition } from '../types';

export const politicalDisinfoScenario: ScenarioDefinition = {
  id: 'misinfo-2',
  category: 'misinformation',
  inbrief: {
    title: "Political Interference Claims",
    summary: "Your company is accused of manipulating user data to influence political opinions. Screenshots purporting to show internal documents are circulating online.",
    objectives: [
      "Verify document authenticity",
      "Address public concerns",
      "Maintain political neutrality",
      "Protect user privacy",
      "Document false claims"
    ],
    stakeholders: [
      "Legal Team",
      "Data Privacy Officers",
      "Communications Team",
      "Board Members",
      "Government Relations"
    ],
    resources: [
      "Internal Audits",
      "Data Policies",
      "PR Resources",
      "Legal Framework",
      "External Auditors"
    ],
    initialSituation: "Multiple news outlets are reporting on alleged internal documents showing your company's involvement in political manipulation. Social media engagement is growing rapidly."
  },
  steps: [
    {
      id: 'start',
      description: "The allegations are spreading quickly. Media outlets are requesting comments.",
      options: [
        {
          text: "Commission independent audit",
          impact: "high",
          nextStepId: "audit",
          consequence: "Shows commitment to transparency but takes time.",
          requiresFollowUp: {
            question: "Which auditing firm will you engage?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Issue immediate denial",
          impact: "medium",
          nextStepId: "denial",
          consequence: "Quick response but may seem defensive.",
          requiresFollowUp: {
            question: "Draft the denial statement:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Share internal documents",
          impact: "high",
          nextStepId: "documents",
          consequence: "Transparency helps but risks revealing sensitive info.",
          requiresFollowUp: {
            question: "What documents will you share?",
            type: "text",
            validation: "length:150"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
