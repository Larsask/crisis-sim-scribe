
import { ScenarioDefinition } from '../types';

export const securityBreachScenario: ScenarioDefinition = {
  id: 'realtime-4',
  category: 'real-time',
  inbrief: {
    title: "Active Security Breach",
    summary: "A real-time security breach is occurring with active unauthorized access to critical systems.",
    objectives: [
      "Stop unauthorized access",
      "Protect sensitive data",
      "Track intruders",
      "Secure systems",
      "Document intrusion"
    ],
    stakeholders: [
      "Security Team",
      "IT Department",
      "Management",
      "Legal Team",
      "Compliance"
    ],
    resources: [
      "Security Tools",
      "Access Logs",
      "Response Team",
      "Forensics Kit",
      "Backup Systems"
    ],
    initialSituation: "Active intrusion detected in core systems at 3:20 PM. Unauthorized access observed across multiple security layers."
  },
  steps: [
    {
      id: 'start',
      description: "Intruders are actively moving through systems and accessing sensitive data.",
      options: [
        {
          text: "Lock down all systems",
          impact: "high",
          nextStepId: "lockdown",
          consequence: "Stops intrusion but halts operations.",
          requiresFollowUp: {
            question: "Define lockdown protocol:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Track intruder activity",
          impact: "medium",
          nextStepId: "track",
          consequence: "Gathers intelligence but allows continued access.",
          requiresFollowUp: {
            question: "Specify tracking methods:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Isolate critical data",
          impact: "high",
          nextStepId: "isolate",
          consequence: "Protects key assets but may alert intruders.",
          requiresFollowUp: {
            question: "List data protection steps:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
