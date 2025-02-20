
import { ScenarioDefinition } from '../types';

export const insiderThreatScenario: ScenarioDefinition = {
  id: 'cyber-5',
  category: 'cyberattack',
  inbrief: {
    title: "Malicious Insider Activity",
    summary: "An IT administrator with high-level access is suspected of installing backdoors and exfiltrating sensitive data.",
    objectives: [
      "Detect unauthorized access",
      "Remove backdoors",
      "Secure systems",
      "Document evidence",
      "Prevent future threats"
    ],
    stakeholders: [
      "Security Team",
      "HR Department",
      "Legal Counsel",
      "System Admins",
      "Management"
    ],
    resources: [
      "Access Logs",
      "Security Tools",
      "Legal Framework",
      "HR Policies",
      "Forensic Tools"
    ],
    initialSituation: "Unusual system modifications and after-hours access have been detected from a privileged account. The administrator in question has been with the company for 5 years."
  },
  steps: [
    {
      id: 'start',
      description: "The suspicious activity is ongoing and sensitive data continues to be at risk.",
      options: [
        {
          text: "Monitor the admin's activities",
          impact: "high",
          nextStepId: "monitor",
          consequence: "Evidence gathered but risk continues.",
          requiresFollowUp: {
            question: "What specific activities will you monitor?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Revoke access immediately",
          impact: "high",
          nextStepId: "revoke",
          consequence: "Threat contained but alerts the suspect.",
          requiresFollowUp: {
            question: "Which access levels need to be revoked?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Begin legal proceedings",
          impact: "medium",
          nextStepId: "legal",
          consequence: "Legal protection but may be premature.",
          requiresFollowUp: {
            question: "What evidence will you present to legal team?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
    // ... Additional steps would be added here
  ]
};
