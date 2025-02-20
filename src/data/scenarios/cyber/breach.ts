
import { ScenarioDefinition } from '../types';

export const dataBreachScenario: ScenarioDefinition = {
  id: 'cyber-2',
  category: 'cyberattack',
  inbrief: {
    title: "Data Breach Detection",
    summary: "A security audit reveals unauthorized access to customer data spanning several months. Personal information of over 100,000 customers may have been exposed.",
    objectives: [
      "Identify breach scope",
      "Secure compromised systems",
      "Notify affected customers",
      "Implement security fixes",
      "Handle regulatory compliance"
    ],
    stakeholders: [
      "Security Team",
      "Legal Department",
      "Customer Service",
      "PR Team",
      "Compliance Officers"
    ],
    resources: [
      "Security Logs",
      "Customer Database",
      "Legal Framework",
      "Communication Tools",
      "Incident Response Plan"
    ],
    initialSituation: "Security monitoring tools have detected unusual data access patterns dating back three months. Initial investigation suggests customer data including names, addresses, and purchase history may have been accessed."
  },
  steps: [
    {
      id: 'start',
      description: "The breach has been confirmed. Your team needs to assess the damage and respond quickly.",
      options: [
        {
          text: "Begin forensic investigation",
          impact: "high",
          nextStepId: "forensics",
          consequence: "Investigation started but may reveal more compromised data.",
          requiresFollowUp: {
            question: "What specific systems will you investigate first?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Notify affected customers immediately",
          impact: "medium",
          nextStepId: "notification",
          consequence: "Early notification shows transparency but may cause panic.",
          requiresFollowUp: {
            question: "Draft the initial customer notification message:",
            type: "text",
            validation: "length:250"
          }
        },
        {
          text: "Contact data protection authorities",
          impact: "high",
          nextStepId: "authorities",
          consequence: "Proper procedure followed but starts regulatory clock.",
          requiresFollowUp: {
            question: "What specific information will you report?",
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
