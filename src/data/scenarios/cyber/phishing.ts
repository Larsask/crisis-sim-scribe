
import { ScenarioDefinition } from '../types';

export const phishingScenario: ScenarioDefinition = {
  id: 'cyber-4',
  category: 'cyberattack',
  inbrief: {
    title: "Targeted Phishing Campaign",
    summary: "A sophisticated phishing campaign is targeting your executives with highly convincing emails that appear to be from trusted partners.",
    objectives: [
      "Identify compromised accounts",
      "Block phishing emails",
      "Train employees",
      "Secure systems",
      "Prevent data loss"
    ],
    stakeholders: [
      "IT Security",
      "Executive Team",
      "HR Department",
      "Email Admins",
      "Department Heads"
    ],
    resources: [
      "Email Security",
      "Training Materials",
      "Security Policies",
      "Monitoring Tools",
      "IT Support"
    ],
    initialSituation: "Several executives have reported suspicious emails. One CFO already clicked a link and entered credentials before realizing it might be fake."
  },
  steps: [
    {
      id: 'start',
      description: "The phishing campaign is ongoing and more employees are receiving suspicious emails.",
      options: [
        {
          text: "Reset compromised credentials",
          impact: "high",
          nextStepId: "reset-creds",
          consequence: "Access secured but disrupts work.",
          requiresFollowUp: {
            question: "Which systems need immediate password resets?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Block suspicious domains",
          impact: "medium",
          nextStepId: "block-domains",
          consequence: "Phishing reduced but may block legitimate emails.",
          requiresFollowUp: {
            question: "What criteria will you use to identify suspicious domains?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Launch emergency training",
          impact: "medium",
          nextStepId: "training",
          consequence: "Awareness improved but takes time from work.",
          requiresFollowUp: {
            question: "What key points will the training cover?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
    // ... Additional steps would be added here
  ]
};
