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
    },
    {
      id: 'cfo-suspension',
      description: "The CFO has been suspended. Media is now questioning the company's integrity and the board's decision-making process.",
      options: [
        {
          text: "Issue a public statement about the suspension",
          impact: "high",
          nextStepId: "public-statement",
          consequence: "Transparency may help restore trust, but details could be scrutinized.",
          requiresFollowUp: {
            question: "What key points will you include in the statement?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Prepare a crisis communication plan",
          impact: "medium",
          nextStepId: "crisis-plan",
          consequence: "A structured response may mitigate damage, but takes time to implement.",
          requiresFollowUp: {
            question: "What are the main components of your crisis communication plan?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Engage with key stakeholders privately",
          impact: "medium",
          nextStepId: "stakeholder-engagement",
          consequence: "Building trust with stakeholders, but risks leaking information.",
          requiresFollowUp: {
            question: "Who will you contact first and what will you say?",
            type: "text",
            validation: "length:150"
          }
        }
      ],
      timeLimit: 120
    },
    {
      id: 'audit',
      description: "The emergency audit is underway. Initial findings suggest deeper issues within the company.",
      options: [
        {
          text: "Prepare a report for the board",
          impact: "high",
          nextStepId: "audit-report",
          consequence: "The report may reveal critical issues but could also lead to panic.",
          requiresFollowUp: {
            question: "What key findings will you highlight in the report?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Communicate findings to the media",
          impact: "medium",
          nextStepId: "media-communication",
          consequence: "Transparency may help, but could also lead to further scrutiny.",
          requiresFollowUp: {
            question: "What will you disclose to the media?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Implement immediate corrective actions",
          impact: "high",
          nextStepId: "corrective-actions",
          consequence: "Quick actions may prevent further damage but could be seen as reactive.",
          requiresFollowUp: {
            question: "What actions will you take immediately?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 150
    },
    {
      id: 'board-meeting',
      description: "The board meeting is in session. Tensions are high as members discuss the next steps.",
      options: [
        {
          text: "Propose a public relations strategy",
          impact: "medium",
          nextStepId: "pr-strategy",
          consequence: "A proactive strategy may help manage public perception.",
          requiresFollowUp: {
            question: "What will be the key elements of your PR strategy?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Discuss potential legal implications",
          impact: "high",
          nextStepId: "legal-discussion",
          consequence: "Understanding legal risks is crucial, but may lead to defensive actions.",
          requiresFollowUp: {
            question: "What legal concerns should be addressed?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Plan for a shareholder meeting",
          impact: "medium",
          nextStepId: "shareholder-meeting",
          consequence: "Engaging shareholders can build trust but may also raise concerns.",
          requiresFollowUp: {
            question: "What will be the agenda for the shareholder meeting?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
