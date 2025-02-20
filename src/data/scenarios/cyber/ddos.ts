
import { ScenarioDefinition } from '../types';

export const ddosScenario: ScenarioDefinition = {
  id: 'cyber-3',
  category: 'cyberattack',
  inbrief: {
    title: "DDoS Attack Crisis",
    summary: "A massive DDoS attack is overwhelming your company's servers, causing service outages for customers worldwide.",
    objectives: [
      "Mitigate attack impact",
      "Restore service availability",
      "Identify attack source",
      "Protect infrastructure",
      "Maintain customer trust"
    ],
    stakeholders: [
      "IT Operations",
      "Network Security",
      "Customer Support",
      "Executive Team",
      "Service Providers"
    ],
    resources: [
      "DDoS Protection",
      "Network Monitoring",
      "Backup Systems",
      "Crisis Response Plan",
      "Technical Support"
    ],
    initialSituation: "Your monitoring systems detect a sudden spike in traffic, 500% above normal levels. Multiple services are becoming unresponsive."
  },
  steps: [
    {
      id: 'start',
      description: "Services are going down one by one. Customer complaints are flooding in.",
      options: [
        {
          text: "Activate DDoS mitigation",
          impact: "high",
          nextStepId: "mitigation",
          consequence: "Protection engaged but may affect legitimate traffic.",
          requiresFollowUp: {
            question: "Specify mitigation parameters to implement:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Scale up server capacity",
          impact: "medium",
          nextStepId: "scale-up",
          consequence: "More resources available but increases costs.",
          requiresFollowUp: {
            question: "Which services should be scaled first?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Contact ISP for assistance",
          impact: "high",
          nextStepId: "isp-help",
          consequence: "Additional support engaged but takes time.",
          requiresFollowUp: {
            question: "What specific assistance will you request?",
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
