
import { ScenarioDefinition } from '../types';

export const infrastructureScenario: ScenarioDefinition = {
  id: 'realtime-5',
  category: 'real-time',
  inbrief: {
    title: "Infrastructure Collapse",
    summary: "Critical infrastructure systems are failing, threatening core operations and service delivery.",
    objectives: [
      "Stabilize systems",
      "Maintain services",
      "Deploy alternatives",
      "Protect assets",
      "Restore functionality"
    ],
    stakeholders: [
      "Operations Team",
      "Technical Staff",
      "Emergency Response",
      "Management",
      "Service Users"
    ],
    resources: [
      "Backup Power",
      "Emergency Systems",
      "Technical Team",
      "Recovery Plans",
      "Support Equipment"
    ],
    initialSituation: "Major infrastructure components begin failing at 9:15 AM. Power systems, network connectivity, and cooling systems are all showing critical errors."
  },
  steps: [
    {
      id: 'start',
      description: "Infrastructure continues to degrade with multiple system failures.",
      options: [
        {
          text: "Activate emergency power",
          impact: "high",
          nextStepId: "power",
          consequence: "Maintains critical systems but limited capacity.",
          requiresFollowUp: {
            question: "Prioritize power distribution:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Begin evacuation",
          impact: "high",
          nextStepId: "evacuate",
          consequence: "Ensures safety but completely stops operations.",
          requiresFollowUp: {
            question: "Detail evacuation procedure:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Deploy mobile infrastructure",
          impact: "medium",
          nextStepId: "mobile",
          consequence: "Provides backup but takes time to deploy.",
          requiresFollowUp: {
            question: "Specify deployment sequence:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
