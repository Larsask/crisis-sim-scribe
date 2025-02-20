
import { ScenarioDefinition } from '../types';

export const employeeSabotageScenario: ScenarioDefinition = {
  id: 'insider-4',
  category: 'insider-threat',
  inbrief: {
    title: "Employee Sabotage Incident",
    summary: "A disgruntled employee is actively sabotaging company systems and data.",
    objectives: [
      "Stop ongoing damage",
      "Identify affected systems",
      "Secure assets",
      "Gather evidence",
      "Restore operations"
    ],
    stakeholders: [
      "IT Security",
      "HR Department",
      "Legal Team",
      "Department Managers",
      "System Administrators"
    ],
    resources: [
      "Security Tools",
      "Access Logs",
      "HR Records",
      "Backup Systems",
      "Legal Support"
    ],
    initialSituation: "Multiple systems show signs of intentional damage, and critical data is being deleted or corrupted. Employee suspect identified but still has system access."
  },
  steps: [
    {
      id: 'start',
      description: "Sabotage is ongoing and systems continue to be compromised.",
      options: [
        {
          text: "Lock out suspect immediately",
          impact: "high",
          nextStepId: "lockout",
          consequence: "Stops damage but may trigger deadman switch.",
          requiresFollowUp: {
            question: "Detail lockout procedure:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Begin covert monitoring",
          impact: "medium",
          nextStepId: "monitor",
          consequence: "Gathers evidence but allows continued access.",
          requiresFollowUp: {
            question: "Specify monitoring approach:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Activate system backups",
          impact: "high",
          nextStepId: "backup",
          consequence: "Preserves data but may alert suspect.",
          requiresFollowUp: {
            question: "List backup priorities:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
