
import { ScenarioDefinition } from '../types';

export const systemFailureScenario: ScenarioDefinition = {
  id: 'realtime-3',
  category: 'real-time',
  inbrief: {
    title: "System-Wide Failure",
    summary: "Critical systems are experiencing cascading failures affecting core business operations.",
    objectives: [
      "Stop failure cascade",
      "Restore critical systems",
      "Protect data integrity",
      "Resume operations",
      "Document incident"
    ],
    stakeholders: [
      "IT Department",
      "Operations Team",
      "Management",
      "Employees",
      "Customers"
    ],
    resources: [
      "Backup Systems",
      "Emergency Protocols",
      "Technical Team",
      "Recovery Tools",
      "Documentation"
    ],
    initialSituation: "At 11:45 AM, core business systems begin failing in sequence. Critical applications are unresponsive, and data integrity is at risk."
  },
  steps: [
    {
      id: 'start',
      description: "Systems continue to fail and operations are severely impacted.",
      options: [
        {
          text: "Initiate emergency shutdown",
          impact: "high",
          nextStepId: "shutdown",
          consequence: "Prevents further damage but halts all operations.",
          requiresFollowUp: {
            question: "Detail shutdown sequence:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Isolate critical systems",
          impact: "medium",
          nextStepId: "isolate",
          consequence: "Protects core functions but limits capabilities.",
          requiresFollowUp: {
            question: "List systems to isolate:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Deploy recovery team",
          impact: "high",
          nextStepId: "recovery",
          consequence: "Begins restoration but takes time to show results.",
          requiresFollowUp: {
            question: "Specify recovery priorities:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
