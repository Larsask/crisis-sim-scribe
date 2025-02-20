
import { ScenarioDefinition } from '../types';

export const ransomwareScenario: ScenarioDefinition = {
  id: 'cyber-1',
  category: 'cyberattack',
  inbrief: {
    title: "Critical Ransomware Attack",
    summary: "A sophisticated ransomware attack has encrypted critical systems across multiple offices. The attackers are demanding payment in cryptocurrency, threatening to delete all data within 48 hours.",
    objectives: [
      "Contain the ransomware spread",
      "Assess system compromise scope",
      "Evaluate backup integrity",
      "Manage stakeholder communications",
      "Determine response strategy"
    ],
    stakeholders: [
      "IT Security Team",
      "Executive Board",
      "Legal Department",
      "Insurance Provider",
      "Law Enforcement"
    ],
    resources: [
      "Incident Response Team",
      "Backup Systems",
      "Cyber Insurance Policy",
      "External Security Consultants",
      "Emergency Communication Channels"
    ],
    initialSituation: "At 6:30 AM, your monitoring systems detect widespread encryption of critical files across the network. A ransom note demands 50 Bitcoin within 48 hours, threatening to delete all data and expose sensitive information. Initial assessment shows 60% of systems affected, including customer databases and financial records. The encryption is spreading rapidly."
  },
  steps: [
    {
      id: 'start',
      description: "Systems are being encrypted in real-time. The ransomware is spreading through the network. Your team needs immediate direction.",
      options: [
        {
          text: "Initiate complete network shutdown",
          impact: "high",
          nextStepId: "network-shutdown",
          consequence: "Network shutdown stops the spread but halts all operations.",
          requiresFollowUp: {
            question: "Specify the shutdown sequence and critical systems to keep online:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Begin backup restoration",
          impact: "medium",
          nextStepId: "backup-restore",
          consequence: "Restoration started but takes time and may not cover recent data.",
          requiresFollowUp: {
            question: "Prioritize which systems to restore first and explain why:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Contact ransomware negotiation service",
          impact: "high",
          nextStepId: "negotiation",
          consequence: "Negotiators engaged but this signals willingness to pay.",
          requiresFollowUp: {
            question: "What specific information will you share with the negotiators?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 300
    },
    {
      id: 'network-shutdown',
      description: "The network has been shut down. Your team is assessing the impact on operations.",
      options: [
        {
          text: "Notify all employees about the shutdown",
          impact: "medium",
          nextStepId: "notify-employees",
          consequence: "Employees are informed, but confusion arises about the duration of the shutdown.",
          requiresFollowUp: {
            question: "What key points will you communicate to the employees?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Start a forensic investigation",
          impact: "high",
          nextStepId: "forensic-investigation",
          consequence: "Investigation initiated, but it may take time to gather evidence.",
          requiresFollowUp: {
            question: "Who will lead the investigation team?",
            type: "text"
          }
        },
        {
          text: "Prepare a public statement",
          impact: "medium",
          nextStepId: "public-statement",
          consequence: "A statement is drafted, but it may need revisions based on new information.",
          requiresFollowUp: {
            question: "What main points will you include in the statement?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    },
    {
      id: 'backup-restore',
      description: "Backup restoration is underway. Initial checks show some data may be irretrievable.",
      options: [
        {
          text: "Communicate with stakeholders about the situation",
          impact: "medium",
          nextStepId: "stakeholder-communication",
          consequence: "Stakeholders are updated, but some express dissatisfaction with the response time.",
          requiresFollowUp: {
            question: "What specific information will you share with stakeholders?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Assess the integrity of the backups",
          impact: "high",
          nextStepId: "backup-assessment",
          consequence: "Backup integrity is confirmed, but some recent data is lost.",
          requiresFollowUp: {
            question: "What criteria will you use to assess backup integrity?",
            type: "text"
          }
        },
        {
          text: "Engage external cybersecurity experts",
          impact: "medium",
          nextStepId: "external-experts",
          consequence: "Experts are brought in, but their availability may delay the process.",
          requiresFollowUp: {
            question: "Which experts will you contact first?",
            type: "text"
          }
        }
      ],
      timeLimit: 240
    },
    {
      id: 'negotiation',
      description: "Negotiators are in contact with the attackers. Time is of the essence.",
      options: [
        {
          text: "Offer a lower amount than requested",
          impact: "high",
          nextStepId: "lower-offer",
          consequence: "The attackers may refuse, but it shows you're not willing to pay the full ransom.",
          requiresFollowUp: {
            question: "What amount will you offer?",
            type: "text"
          }
        },
        {
          text: "Gather more intelligence on the attackers",
          impact: "medium",
          nextStepId: "gather-intelligence",
          consequence: "More information is obtained, but it may take time.",
          requiresFollowUp: {
            question: "What methods will you use to gather intelligence?",
            type: "text"
          }
        },
        {
          text: "Prepare a contingency plan if negotiations fail",
          impact: "high",
          nextStepId: "contingency-plan",
          consequence: "A plan is in place, but it may cause panic among the team.",
          requiresFollowUp: {
            question: "What key elements will be included in the contingency plan?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 300
    }
  ]
};
