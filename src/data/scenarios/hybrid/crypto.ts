
import { ScenarioDefinition } from '../types';

export const cryptoTheftScenario: ScenarioDefinition = {
  id: 'hybrid-5',
  category: 'hybrid',
  inbrief: {
    title: "Cryptocurrency Theft Attempt",
    summary: "Attackers are attempting to steal cryptocurrency assets through a combination of physical access to cold storage facilities and cyber attacks on hot wallets.",
    objectives: [
      "Secure crypto assets",
      "Block unauthorized access",
      "Track theft attempts",
      "Protect key infrastructure",
      "Maintain custody"
    ],
    stakeholders: [
      "Security Team",
      "Wallet Administrators",
      "Financial Team",
      "Legal Department",
      "Exchange Partners"
    ],
    resources: [
      "Wallet Access",
      "Security Protocols",
      "Monitoring Tools",
      "Cold Storage",
      "Transaction Logs"
    ],
    initialSituation: "Multiple unauthorized attempts to access cold storage vaults are detected while hot wallets experience sophisticated cyber attacks. Initial estimates suggest potential exposure of $100M in crypto assets."
  },
  steps: [
    {
      id: 'start',
      description: "Both physical and digital security measures are being tested. Assets remain at risk.",
      options: [
        {
          text: "Freeze all transactions",
          impact: "high",
          nextStepId: "freeze",
          consequence: "Secures assets but disrupts operations.",
          requiresFollowUp: {
            question: "Detail the transaction freeze process:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Transfer to secure wallets",
          impact: "high",
          nextStepId: "transfer",
          consequence: "Protects assets but complex to execute.",
          requiresFollowUp: {
            question: "Specify transfer procedure:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Engage backup security",
          impact: "medium",
          nextStepId: "backup",
          consequence: "Additional protection but may not stop current attempts.",
          requiresFollowUp: {
            question: "List security measures to activate:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
