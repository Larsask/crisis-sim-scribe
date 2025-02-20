
import { ScenarioDefinition } from '../types';

export const serviceOutageScenario: ScenarioDefinition = {
  id: 'realtime-2',
  category: 'real-time',
  inbrief: {
    title: "Critical Service Outage",
    summary: "A major cloud service outage is affecting critical business operations and customer-facing services.",
    objectives: [
      "Restore core services",
      "Minimize downtime",
      "Manage customer impact",
      "Deploy contingencies",
      "Maintain communication"
    ],
    stakeholders: [
      "IT Operations",
      "Customer Support",
      "Executive Team",
      "Service Providers",
      "Key Clients"
    ],
    resources: [
      "Backup Systems",
      "Status Dashboard",
      "Support Teams",
      "Communication Tools",
      "Recovery Plans"
    ],
    initialSituation: "Multiple critical services are experiencing outages affecting 80% of your customer base. Initial reports indicate cascading failures across cloud infrastructure."
  },
  steps: [
    {
      id: 'start',
      description: "Services continue to fail and customer complaints are mounting.",
      options: [
        {
          text: "Activate backup systems",
          impact: "high",
          nextStepId: "backup",
          consequence: "Restores some services but at reduced capacity.",
          requiresFollowUp: {
            question: "Prioritize systems for backup activation:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Issue status update",
          impact: "medium",
          nextStepId: "status",
          consequence: "Informs stakeholders but highlights crisis.",
          requiresFollowUp: {
            question: "Draft the status update message:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Begin manual operations",
          impact: "high",
          nextStepId: "manual",
          consequence: "Maintains critical functions but very limited capacity.",
          requiresFollowUp: {
            question: "Define manual operation procedures:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
