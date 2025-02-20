
import { ScenarioDefinition } from '../types';

export const aiPrivacyScenario: ScenarioDefinition = {
  id: 'ai-2',
  category: 'ai-powered',
  inbrief: {
    title: "AI Privacy Breach Alert",
    summary: "Your AI system has been found to inadvertently expose sensitive user data through its response patterns, potentially violating data protection regulations.",
    objectives: [
      "Contain data exposure",
      "Assess privacy impact",
      "Fix AI system vulnerabilities",
      "Notify affected users",
      "Ensure regulatory compliance"
    ],
    stakeholders: [
      "AI Development Team",
      "Privacy Officers",
      "Legal Department",
      "Affected Users",
      "Data Protection Authority"
    ],
    resources: [
      "AI System Logs",
      "Privacy Framework",
      "Audit Tools",
      "Legal Team",
      "Communication Platform"
    ],
    initialSituation: "At 09:15 AM, your AI privacy monitoring system detects that the company's customer service AI has been inadvertently including fragments of user data in its responses. Initial analysis suggests that personal information from up to 50,000 customers may have been exposed over the past week."
  },
  steps: [
    {
      id: 'start',
      description: "The AI system is still operational and potentially exposing more data. Privacy teams are analyzing the extent of the breach.",
      options: [
        {
          text: "Shut down AI system immediately",
          impact: "high",
          nextStepId: "shutdown",
          consequence: "Stops data exposure but disrupts customer service operations.",
          requiresFollowUp: {
            question: "Detail the immediate transition plan for customer service:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Deploy privacy patch",
          impact: "medium",
          nextStepId: "patch",
          consequence: "Addresses issue but may not catch all cases.",
          requiresFollowUp: {
            question: "Specify the key components of the privacy patch:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Begin user notification process",
          impact: "high",
          nextStepId: "notify",
          consequence: "Transparent but may cause panic.",
          requiresFollowUp: {
            question: "Draft the initial user notification message:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
