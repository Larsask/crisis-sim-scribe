import { ScenarioDefinition } from '../types';

export const aiHiringScenario: ScenarioDefinition = {
  id: 'ai-1',
  category: 'ai-powered',
  inbrief: {
    title: "AI System Ethical Crisis",
    summary: "Your company's AI-powered hiring system has been found to show significant bias against certain demographic groups. An investigation reveals concerning patterns in its decision-making process.",
    objectives: [
      "Assess AI system bias",
      "Address discrimination concerns",
      "Review affected applications",
      "Implement corrective measures",
      "Rebuild public trust"
    ],
    stakeholders: [
      "AI Development Team",
      "HR Department",
      "Legal Team",
      "Affected Applicants",
      "Ethics Board"
    ],
    resources: [
      "AI Audit Tools",
      "HR Records",
      "Ethics Guidelines",
      "Technical Documentation",
      "PR Response Team"
    ],
    initialSituation: "A data scientist's analysis reveals your AI hiring system has been showing a 35% bias against certain demographics. The findings are about to be published in a major tech journal."
  },
  steps: [
    {
      id: 'start',
      description: "The technical team confirms the bias. Legal warns of potential discrimination lawsuits. HR is reviewing thousands of potentially affected applications.",
      options: [
        {
          text: "Shut down AI system immediately",
          impact: "high",
          nextStepId: "system-shutdown",
          consequence: "System halted but disrupts ongoing hiring processes.",
          requiresFollowUp: {
            question: "Detail the transition plan for current hiring processes:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Launch comprehensive audit",
          impact: "medium",
          nextStepId: "audit",
          consequence: "Audit started but may reveal more issues.",
          requiresFollowUp: {
            question: "Define the specific parameters for the AI audit:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Contact affected applicants",
          impact: "high",
          nextStepId: "applicant-contact",
          consequence: "Transparency shown but opens legal exposure.",
          requiresFollowUp: {
            question: "Draft the message to affected applicants:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    },
    {
      id: 'system-shutdown',
      description: "The AI system is shut down. HR is scrambling to manage ongoing recruitment processes without the system.",
      options: [
        {
          text: "Communicate the shutdown to all stakeholders",
          impact: "medium",
          nextStepId: "stakeholder-communication",
          consequence: "Stakeholders are informed, but concerns about recruitment delays arise.",
          requiresFollowUp: {
            question: "What key points will you communicate in the stakeholder message?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Begin manual review of applications",
          impact: "high",
          nextStepId: "manual-review",
          consequence: "Manual review initiated, but it will take significantly longer to process applications.",
          requiresFollowUp: {
            question: "How will you prioritize applications for review?",
            type: "text",
            validation: "length:150"
          }
        }
      ],
      timeLimit: 180
    },
    {
      id: 'audit',
      description: "The audit team is gathering data on the AI system's decision-making processes. Initial findings are concerning.",
      options: [
        {
          text: "Prepare a public statement about the audit findings",
          impact: "high",
          nextStepId: "public-statement",
          consequence: "Transparency may help rebuild trust, but could also attract negative media attention.",
          requiresFollowUp: {
            question: "What key findings will you disclose in the statement?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Implement immediate corrective measures",
          impact: "medium",
          nextStepId: "corrective-measures",
          consequence: "Measures taken may mitigate bias, but could disrupt current hiring processes.",
          requiresFollowUp: {
            question: "What specific measures will you implement immediately?",
            type: "text",
            validation: "length:150"
          }
        }
      ],
      timeLimit: 240
    },
    {
      id: 'applicant-contact',
      description: "Affected applicants are being contacted. Some express outrage, while others appreciate the transparency.",
      options: [
        {
          text: "Offer affected applicants a chance to reapply",
          impact: "medium",
          nextStepId: "reapply-offer",
          consequence: "Reapplication may help restore trust, but could complicate the hiring process.",
          requiresFollowUp: {
            question: "What will you include in the reapplication offer?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Set up a dedicated support line for inquiries",
          impact: "low",
          nextStepId: "support-line",
          consequence: "Support line helps manage inquiries but requires additional resources.",
          requiresFollowUp: {
            question: "What resources will you allocate for the support line?",
            type: "text",
            validation: "length:150"
          }
        }
      ],
      timeLimit: 180
    },
    {
      id: 'public-statement',
      description: "The public statement is drafted and ready for release. Legal is reviewing the content.",
      options: [
        {
          text: "Release the statement immediately",
          impact: "high",
          nextStepId: "statement-released",
          consequence: "Immediate release may help manage public perception, but could lead to backlash.",
          requiresFollowUp: {
            question: "What final checks will you perform before release?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Delay the release for further review",
          impact: "medium",
          nextStepId: "delay-release",
          consequence: "Delay may allow for a more polished statement, but risks losing momentum.",
          requiresFollowUp: {
            question: "What reasons will you provide for the delay?",
            type: "text",
            validation: "length:150"
          }
        }
      ],
      timeLimit: 120
    }
  ]
};
