
import { ScenarioDefinition } from '../types';

export const customerDataScenario: ScenarioDefinition = {
  id: 'reputation-5',
  category: 'reputation',
  inbrief: {
    title: "Customer Trust Crisis",
    summary: "An investigation reveals your company has been mishandling customer data, potentially violating privacy laws and trust agreements.",
    objectives: [
      "Assess data handling practices",
      "Address customer concerns",
      "Ensure compliance",
      "Rebuild trust",
      "Implement reforms"
    ],
    stakeholders: [
      "Privacy Team",
      "Legal Department",
      "Customer Service",
      "Executive Board",
      "Regulatory Bodies"
    ],
    resources: [
      "Data Audit Tools",
      "Legal Framework",
      "Customer Records",
      "Communication Plan",
      "Compliance Team"
    ],
    initialSituation: "Internal auditors have discovered that customer data has been improperly handled for the past 18 months, potentially affecting 500,000 customers. The mishandling includes unauthorized sharing with third parties and insufficient protection measures. Consumer advocacy groups are preparing legal action."
  },
  steps: [
    {
      id: 'start',
      description: "The audit findings are clear and legal threats are mounting. Customer trust is at stake.",
      options: [
        {
          text: "Notify affected customers",
          impact: "high",
          nextStepId: "notification",
          consequence: "Transparency builds trust but may trigger legal action.",
          requiresFollowUp: {
            question: "Draft the customer notification message:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Review all data practices",
          impact: "medium",
          nextStepId: "review",
          consequence: "Thorough assessment but delays response.",
          requiresFollowUp: {
            question: "What aspects of data handling will you review first?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Implement immediate reforms",
          impact: "high",
          nextStepId: "reforms",
          consequence: "Shows action but may disrupt operations.",
          requiresFollowUp: {
            question: "List the key reforms to implement:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
