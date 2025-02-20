import { ScenarioDefinition } from '../types';

export const supplyChainScenario: ScenarioDefinition = {
  id: 'hybrid-1',
  category: 'hybrid',
  inbrief: {
    title: "Supply Chain Cyber-Sabotage",
    summary: "A sophisticated attack combines physical tampering with cyber intrusion in your supply chain. Critical shipments are being redirected while system logs are altered to hide the changes.",
    objectives: [
      "Trace compromised shipments",
      "Identify attack vectors",
      "Secure supply chain",
      "Detect insider involvement",
      "Restore system integrity"
    ],
    stakeholders: [
      "Security Team",
      "Logistics Department",
      "Supply Chain Partners",
      "Customers",
      "Law Enforcement"
    ],
    resources: [
      "Tracking Systems",
      "Security Cameras",
      "Access Logs",
      "Partner Network",
      "Forensics Team"
    ],
    initialSituation: "Multiple high-value shipments have deviated from their routes. Security systems show no unauthorized access, but physical inventory doesn't match digital records."
  },
  steps: [
    {
      id: 'start',
      description: "Three more shipments just disappeared from tracking. Security footage has been tampered with. A suspicious pattern in employee access cards is detected.",
      options: [
        {
          text: "Lock down all shipping operations",
          impact: "high",
          nextStepId: "lockdown",
          consequence: "Operations halted but prevents further losses.",
          requiresFollowUp: {
            question: "Specify which operations to freeze and which to maintain:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Deploy physical security teams",
          impact: "medium",
          nextStepId: "security-teams",
          consequence: "Teams deployed but coverage is limited.",
          requiresFollowUp: {
            question: "Prioritize security team deployment locations and tasks:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Activate backup tracking system",
          impact: "high",
          nextStepId: "backup-tracking",
          consequence: "Backup system online but may be compromised.",
          requiresFollowUp: {
            question: "List critical parameters to monitor in the backup system:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 300
    },
    {
      id: 'lockdown',
      description: "All shipping operations are locked down. The team is assessing the impact on deliveries and customer relations.",
      options: [
        {
          text: "Notify customers about the lockdown",
          impact: "medium",
          nextStepId: "customer-notification",
          consequence: "Customers are informed, but some may react negatively.",
          requiresFollowUp: {
            question: "What key points will you communicate to customers?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Conduct a full security audit",
          impact: "high",
          nextStepId: "security-audit",
          consequence: "Audit reveals potential vulnerabilities but takes time.",
          requiresFollowUp: {
            question: "What areas will you prioritize in the audit?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Engage law enforcement",
          impact: "high",
          nextStepId: "law-enforcement",
          consequence: "Law enforcement involvement may escalate the situation.",
          requiresFollowUp: {
            question: "What information will you provide to law enforcement?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    },
    {
      id: 'security-teams',
      description: "Physical security teams are deployed to key locations. Initial reports indicate no immediate threats, but the situation remains tense.",
      options: [
        {
          text: "Increase surveillance on critical areas",
          impact: "medium",
          nextStepId: "increased-surveillance",
          consequence: "Surveillance helps identify potential threats but increases operational costs.",
          requiresFollowUp: {
            question: "Which areas will you focus on for increased surveillance?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Conduct interviews with employees",
          impact: "medium",
          nextStepId: "employee-interviews",
          consequence: "Interviews may reveal insider threats but could cause unrest among staff.",
          requiresFollowUp: {
            question: "What key questions will you ask during the interviews?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Review access logs for anomalies",
          impact: "high",
          nextStepId: "access-log-review",
          consequence: "Anomalies found may lead to further investigation.",
          requiresFollowUp: {
            question: "What specific logs will you review first?",
            type: "text",
            validation: "length:150"
          }
        }
      ],
      timeLimit: 240
    },
    {
      id: 'backup-tracking',
      description: "The backup tracking system is activated. Initial data shows discrepancies in shipment routes.",
      options: [
        {
          text: "Cross-reference with original shipment data",
          impact: "high",
          nextStepId: "data-cross-reference",
          consequence: "Cross-referencing reveals critical information but takes time.",
          requiresFollowUp: {
            question: "What specific data points will you compare?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Alert partners about potential issues",
          impact: "medium",
          nextStepId: "partner-alert",
          consequence: "Partners are informed, but this may lead to panic.",
          requiresFollowUp: {
            question: "What key points will you communicate to partners?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Prepare a contingency plan",
          impact: "high",
          nextStepId: "contingency-plan",
          consequence: "A contingency plan is ready but may not cover all scenarios.",
          requiresFollowUp: {
            question: "What scenarios will you include in the contingency plan?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 300
    }
  ]
};
