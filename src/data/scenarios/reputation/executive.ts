
import { ScenarioDefinition } from '../types';

export const executiveMisconductScenario: ScenarioDefinition = {
  id: 'reputation-1',
  category: 'reputation',
  inbrief: {
    title: "Executive Misconduct Scandal",
    summary: "A video showing your CFO making inappropriate comments about customers and revealing potential financial misconduct has been leaked. The video is from a private executive meeting and is spreading rapidly.",
    objectives: [
      "Verify video authenticity",
      "Manage public perception",
      "Address stakeholder concerns",
      "Handle regulatory implications",
      "Implement damage control"
    ],
    stakeholders: [
      "Board of Directors",
      "Shareholders",
      "Employees",
      "Media Relations",
      "Regulatory Bodies"
    ],
    resources: [
      "Crisis PR Team",
      "Legal Counsel",
      "Financial Auditors",
      "HR Department",
      "Corporate Communications"
    ],
    initialSituation: "The video was posted 30 minutes ago and has already reached major news networks. Stock price is dropping, and #CompanyScandal is trending. The CFO is currently unreachable."
  },
  steps: [
    {
      id: 'start',
      description: "The board is demanding immediate action, shareholders are calling, and reporters are flooding your PR department.",
      options: [
        {
          text: "Suspend CFO pending investigation",
          impact: "high",
          nextStepId: "cfo-suspension",
          consequence: "Action shows decisiveness but may imply guilt.",
          requiresFollowUp: {
            question: "Draft the official suspension announcement:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Commission emergency audit",
          impact: "medium",
          nextStepId: "audit",
          consequence: "Audit initiated but suggests potential systemic issues.",
          requiresFollowUp: {
            question: "Define the scope and timeline for the emergency audit:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Hold emergency board meeting",
          impact: "high",
          nextStepId: "board-meeting",
          consequence: "Board convened but delays public response.",
          requiresFollowUp: {
            question: "Prepare the board meeting agenda with key discussion points:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180,
      isJournalistCall: true
    }
  ]
};
