
import { ScenarioDefinition } from '../types';

export const executiveLeakScenario: ScenarioDefinition = {
  id: 'insider-2',
  category: 'insider-threat',
  inbrief: {
    title: "Executive Data Leak",
    summary: "A senior executive is suspected of leaking confidential information to competitors.",
    objectives: [
      "Confirm leak source",
      "Protect sensitive data",
      "Gather evidence",
      "Minimize exposure",
      "Plan response"
    ],
    stakeholders: [
      "Board Members",
      "Legal Team",
      "HR Department",
      "Security Team",
      "PR Department"
    ],
    resources: [
      "Access Logs",
      "Legal Counsel",
      "Security Tools",
      "HR Records",
      "Communication Plan"
    ],
    initialSituation: "Evidence suggests a C-level executive has been sharing confidential strategic plans with a competitor. Initial investigation shows unusual access patterns to sensitive documents."
  },
  steps: [
    {
      id: 'start',
      description: "Leak appears ongoing and sensitive information remains at risk.",
      options: [
        {
          text: "Monitor executive activity",
          impact: "high",
          nextStepId: "monitor",
          consequence: "Gathers evidence but allows continued access.",
          requiresFollowUp: {
            question: "Define monitoring parameters:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Restrict system access",
          impact: "high",
          nextStepId: "restrict",
          consequence: "Limits damage but alerts suspect.",
          requiresFollowUp: {
            question: "List access restrictions:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Begin legal preparation",
          impact: "medium",
          nextStepId: "legal",
          consequence: "Builds case but takes time.",
          requiresFollowUp: {
            question: "Outline legal strategy:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
