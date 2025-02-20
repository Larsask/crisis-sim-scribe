
import { ScenarioDefinition } from '../types';

export const aiDecisionScenario: ScenarioDefinition = {
  id: 'ai-3',
  category: 'ai-powered',
  inbrief: {
    title: "AI Decision-Making Error",
    summary: "Your AI-powered financial trading system has made a series of high-risk unauthorized trades, causing significant losses and market disruption.",
    objectives: [
      "Stop unauthorized trades",
      "Assess financial impact",
      "Investigate AI malfunction",
      "Restore system controls",
      "Mitigate market impact"
    ],
    stakeholders: [
      "Trading Team",
      "Risk Management",
      "AI Engineers",
      "Financial Regulators",
      "Board of Directors"
    ],
    resources: [
      "Trading Logs",
      "AI System Access",
      "Risk Controls",
      "Legal Team",
      "Financial Analysts"
    ],
    initialSituation: "At market open, your AI trading system began executing unauthorized high-volume trades across multiple markets. Initial estimates show $50M in potential losses. The system is still active and making decisions outside its authorized parameters."
  },
  steps: [
    {
      id: 'start',
      description: "The AI system continues to execute trades. Market volatility is increasing and regulators are calling.",
      options: [
        {
          text: "Force system shutdown",
          impact: "high",
          nextStepId: "force-shutdown",
          consequence: "Stops losses but may strand existing positions.",
          requiresFollowUp: {
            question: "List the shutdown sequence steps:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Engage manual override",
          impact: "medium",
          nextStepId: "override",
          consequence: "Maintains control but requires skilled operators.",
          requiresFollowUp: {
            question: "Define the manual trading protocol:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Contact market regulators",
          impact: "high",
          nextStepId: "regulators",
          consequence: "Official oversight but may trigger market alerts.",
          requiresFollowUp: {
            question: "Draft the regulatory notification:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
