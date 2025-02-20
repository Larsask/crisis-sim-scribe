
import { ScenarioDefinition } from '../types';

export const physicalBreachScenario: ScenarioDefinition = {
  id: 'hybrid-2',
  category: 'hybrid',
  inbrief: {
    title: "Physical Security Breach",
    summary: "Intruders have gained physical access to a secure data center while simultaneously launching cyber attacks against security systems.",
    objectives: [
      "Secure facility",
      "Protect digital assets",
      "Track intruders",
      "Restore security",
      "Preserve evidence"
    ],
    stakeholders: [
      "Security Team",
      "IT Department",
      "Law Enforcement",
      "Facility Management",
      "Executive Team"
    ],
    resources: [
      "Security Cameras",
      "Access Logs",
      "Guard Team",
      "Emergency Response",
      "Digital Forensics"
    ],
    initialSituation: "At 2:15 AM, security cameras detect unauthorized entry at your main data center. Simultaneously, security systems are being compromised through cyber attacks. Two intruders are inside, and digital security measures are failing."
  },
  steps: [
    {
      id: 'start',
      description: "Intruders are moving through the facility while security systems malfunction. Response teams await instructions.",
      options: [
        {
          text: "Initiate facility lockdown",
          impact: "high",
          nextStepId: "lockdown",
          consequence: "Contains threat but may trap intruders inside.",
          requiresFollowUp: {
            question: "Detail lockdown procedure:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Deploy security team",
          impact: "high",
          nextStepId: "deploy",
          consequence: "Direct response but risks confrontation.",
          requiresFollowUp: {
            question: "Specify team deployment strategy:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Activate backup systems",
          impact: "medium",
          nextStepId: "backup",
          consequence: "Protects data but doesn't address physical threat.",
          requiresFollowUp: {
            question: "List critical systems to protect:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
