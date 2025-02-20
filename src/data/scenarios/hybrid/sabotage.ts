
import { ScenarioDefinition } from '../types';

export const industrialSabotageScenario: ScenarioDefinition = {
  id: 'hybrid-4',
  category: 'hybrid',
  inbrief: {
    title: "Industrial Sabotage Incident",
    summary: "A coordinated sabotage attempt targets both physical manufacturing equipment and industrial control systems.",
    objectives: [
      "Protect production systems",
      "Identify sabotage points",
      "Secure facility",
      "Prevent equipment damage",
      "Maintain operations"
    ],
    stakeholders: [
      "Operations Team",
      "Security Personnel",
      "Engineering Staff",
      "Management",
      "Quality Control"
    ],
    resources: [
      "Control Systems",
      "Security Cameras",
      "Maintenance Crew",
      "Backup Controls",
      "Safety Protocols"
    ],
    initialSituation: "Manufacturing line sensors detect multiple equipment malfunctions while industrial control systems show signs of tampering. Production quality is declining rapidly, and safety systems are reporting inconsistent readings."
  },
  steps: [
    {
      id: 'start',
      description: "Production systems are behaving erratically and safety concerns are mounting.",
      options: [
        {
          text: "Emergency shutdown",
          impact: "high",
          nextStepId: "shutdown",
          consequence: "Prevents damage but halts production.",
          requiresFollowUp: {
            question: "Outline shutdown sequence:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Manual override",
          impact: "high",
          nextStepId: "override",
          consequence: "Maintains control but requires skilled operators.",
          requiresFollowUp: {
            question: "List required operator actions:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Isolate affected systems",
          impact: "medium",
          nextStepId: "isolate",
          consequence: "Contains damage but reduces capacity.",
          requiresFollowUp: {
            question: "Specify isolation procedures:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
