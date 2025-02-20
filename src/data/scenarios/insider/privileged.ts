
import { ScenarioDefinition } from '../types';

export const privilegedAccessScenario: ScenarioDefinition = {
  id: 'insider-5',
  category: 'insider-threat',
  inbrief: {
    title: "Privileged Access Abuse",
    summary: "A system administrator with high-level access is misusing privileges for unauthorized activities.",
    objectives: [
      "Track unauthorized access",
      "Limit privilege abuse",
      "Protect systems",
      "Document violations",
      "Update access controls"
    ],
    stakeholders: [
      "IT Security",
      "Management",
      "HR Department",
      "Compliance Team",
      "Legal Department"
    ],
    resources: [
      "Access Logs",
      "Security Tools",
      "Policy Documents",
      "Monitoring Systems",
      "Audit Trail"
    ],
    initialSituation: "A senior system administrator is detected using privileged access to view confidential data and modify system configurations without authorization."
  },
  steps: [
    {
      id: 'start',
      description: "Unauthorized access continues and sensitive systems remain exposed.",
      options: [
        {
          text: "Revoke admin privileges",
          impact: "high",
          nextStepId: "revoke",
          consequence: "Stops abuse but affects system maintenance.",
          requiresFollowUp: {
            question: "Detail privilege revocation process:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Implement access auditing",
          impact: "medium",
          nextStepId: "audit",
          consequence: "Tracks actions but allows continued access.",
          requiresFollowUp: {
            question: "Define audit parameters:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Deploy security controls",
          impact: "high",
          nextStepId: "controls",
          consequence: "Limits damage but complex to implement.",
          requiresFollowUp: {
            question: "Specify control measures:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
