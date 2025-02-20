
import { ScenarioDefinition } from '../types';

export const aiSecurityScenario: ScenarioDefinition = {
  id: 'ai-4',
  category: 'ai-powered',
  inbrief: {
    title: "AI Security Compromise",
    summary: "Your AI security system has been compromised, potentially allowing unauthorized access to critical infrastructure and sensitive data.",
    objectives: [
      "Secure AI systems",
      "Detect compromise scope",
      "Block unauthorized access",
      "Restore security controls",
      "Update AI defenses"
    ],
    stakeholders: [
      "Security Team",
      "AI Engineers",
      "System Administrators",
      "Executive Team",
      "External Auditors"
    ],
    resources: [
      "Security Logs",
      "AI Monitoring Tools",
      "Access Controls",
      "Forensic Analysis",
      "Backup Systems"
    ],
    initialSituation: "Security monitoring detects unusual patterns in your AI security system at 2:30 AM. The AI is granting access to unauthorized users and ignoring security protocols. Evidence suggests sophisticated attackers have modified the AI's core decision-making processes."
  },
  steps: [
    {
      id: 'start',
      description: "The compromised AI continues to operate, potentially exposing more systems. Security teams are tracking multiple unauthorized access attempts.",
      options: [
        {
          text: "Activate emergency lockdown",
          impact: "high",
          nextStepId: "lockdown",
          consequence: "Secures systems but halts operations.",
          requiresFollowUp: {
            question: "Specify lockdown procedure steps:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Deploy backup security protocols",
          impact: "medium",
          nextStepId: "backup",
          consequence: "Maintains security but may miss sophisticated attacks.",
          requiresFollowUp: {
            question: "List priority backup measures:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Launch forensic investigation",
          impact: "high",
          nextStepId: "investigate",
          consequence: "Identifies attack vector but takes time.",
          requiresFollowUp: {
            question: "Define investigation scope:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
