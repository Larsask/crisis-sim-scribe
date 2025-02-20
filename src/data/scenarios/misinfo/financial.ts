
import { ScenarioDefinition } from '../types';

export const financialDisinfoScenario: ScenarioDefinition = {
  id: 'misinfo-5',
  category: 'misinformation',
  inbrief: {
    title: "Financial Fraud Allegations",
    summary: "Anonymous sources claim your company is involved in financial fraud. Fabricated financial documents are circulating on investment forums.",
    objectives: [
      "Verify financial records",
      "Reassure investors",
      "Address regulatory concerns",
      "Document false claims",
      "Maintain market confidence"
    ],
    stakeholders: [
      "Finance Team",
      "Investors",
      "Board Members",
      "Regulatory Bodies",
      "External Auditors"
    ],
    resources: [
      "Financial Records",
      "Audit Reports",
      "Legal Team",
      "PR Department",
      "Investor Relations"
    ],
    initialSituation: "Anonymous posts on investment forums claim to have evidence of accounting fraud. Stock price has dropped 15% in two hours."
  },
  steps: [
    {
      id: 'start',
      description: "The market is reacting to fraud allegations. Investors are demanding answers.",
      options: [
        {
          text: "Release audited financials",
          impact: "high",
          nextStepId: "financials",
          consequence: "Transparency helps but may reveal sensitive info.",
          requiresFollowUp: {
            question: "What financial details will you disclose?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Hold emergency investor call",
          impact: "medium",
          nextStepId: "investor-call",
          consequence: "Direct communication but risks tough questions.",
          requiresFollowUp: {
            question: "What will you address in the call?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "File legal action",
          impact: "high",
          nextStepId: "legal",
          consequence: "Shows confidence but may escalate situation.",
          requiresFollowUp: {
            question: "What legal actions will you take?",
            type: "text",
            validation: "length:150"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
