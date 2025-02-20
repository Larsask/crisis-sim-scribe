
import { ScenarioDefinition } from '../types';

export const socialEngineeringScenario: ScenarioDefinition = {
  id: 'hybrid-3',
  category: 'hybrid',
  inbrief: {
    title: "Social Engineering Attack",
    summary: "A sophisticated social engineering campaign is targeting employees while exploiting technical vulnerabilities in company systems.",
    objectives: [
      "Identify compromised accounts",
      "Block attack vectors",
      "Alert employees",
      "Secure systems",
      "Prevent data loss"
    ],
    stakeholders: [
      "IT Security",
      "HR Department",
      "Employee Base",
      "Management Team",
      "Training Staff"
    ],
    resources: [
      "Security Tools",
      "Training Materials",
      "Communication Channels",
      "Access Controls",
      "Monitoring Systems"
    ],
    initialSituation: "Multiple employees report suspicious emails and calls from persons claiming to be IT support. Simultaneously, unusual login patterns are detected across company systems. Initial investigation suggests a coordinated attack combining social engineering with technical exploits."
  },
  steps: [
    {
      id: 'start',
      description: "The attack is ongoing with both human and technical components. Employee confusion is spreading.",
      options: [
        {
          text: "Issue company-wide alert",
          impact: "high",
          nextStepId: "alert",
          consequence: "Warns employees but may tip off attackers.",
          requiresFollowUp: {
            question: "Draft the alert message:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Reset critical credentials",
          impact: "high",
          nextStepId: "reset",
          consequence: "Secures access but disrupts work.",
          requiresFollowUp: {
            question: "Prioritize systems for reset:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Launch security audit",
          impact: "medium",
          nextStepId: "audit",
          consequence: "Thorough but time-consuming.",
          requiresFollowUp: {
            question: "Define audit scope:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
