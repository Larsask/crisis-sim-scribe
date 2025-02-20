
import { ScenarioDefinition } from '../types';

export const contractorBreachScenario: ScenarioDefinition = {
  id: 'insider-3',
  category: 'insider-threat',
  inbrief: {
    title: "Contractor Security Breach",
    summary: "A contractor with privileged access is suspected of data theft and system manipulation.",
    objectives: [
      "Identify compromised systems",
      "Revoke access rights",
      "Track data movement",
      "Secure systems",
      "Document incident"
    ],
    stakeholders: [
      "Security Team",
      "Project Managers",
      "Legal Department",
      "IT Department",
      "Contract Management"
    ],
    resources: [
      "Access Controls",
      "Audit Logs",
      "Security Tools",
      "Legal Framework",
      "Documentation"
    ],
    initialSituation: "A senior contractor working on critical systems shows suspicious access patterns and large data transfers outside normal hours."
  },
  steps: [
    {
      id: 'start',
      description: "Contractor maintains system access and data remains at risk.",
      options: [
        {
          text: "Terminate access immediately",
          impact: "high",
          nextStepId: "terminate",
          consequence: "Stops threat but disrupts projects.",
          requiresFollowUp: {
            question: "Detail access termination steps:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Monitor contractor activity",
          impact: "medium",
          nextStepId: "monitor",
          consequence: "Gathers evidence but allows continued access.",
          requiresFollowUp: {
            question: "Specify monitoring scope:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Conduct security audit",
          impact: "high",
          nextStepId: "audit",
          consequence: "Thorough assessment but time-consuming.",
          requiresFollowUp: {
            question: "Define audit parameters:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
