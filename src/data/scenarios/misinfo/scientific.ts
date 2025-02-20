
import { ScenarioDefinition } from '../types';

export const scientificDisinfoScenario: ScenarioDefinition = {
  id: 'misinfo-3',
  category: 'misinformation',
  inbrief: {
    title: "False Research Claims",
    summary: "A paper claiming your product causes environmental damage is being widely shared. The research appears credible but contains manipulated data.",
    objectives: [
      "Verify research claims",
      "Present accurate data",
      "Engage scientific community",
      "Address environmental concerns",
      "Maintain credibility"
    ],
    stakeholders: [
      "Research Team",
      "Environmental Scientists",
      "PR Department",
      "Legal Team",
      "Industry Partners"
    ],
    resources: [
      "Research Data",
      "Environmental Studies",
      "Expert Network",
      "Media Contacts",
      "Scientific Papers"
    ],
    initialSituation: "A research paper claiming your products cause significant environmental damage has been published in a minor journal. Environmental groups are calling for boycotts."
  },
  steps: [
    {
      id: 'start',
      description: "The paper is gaining traction in mainstream media. Environmental groups are organizing protests.",
      options: [
        {
          text: "Publish counter-research",
          impact: "high",
          nextStepId: "research",
          consequence: "Scientific response but may escalate debate.",
          requiresFollowUp: {
            question: "What key findings will you highlight?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Request journal retraction",
          impact: "medium",
          nextStepId: "retraction",
          consequence: "May prevent spread but could appear defensive.",
          requiresFollowUp: {
            question: "What evidence will you present for retraction?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Engage environmental experts",
          impact: "high",
          nextStepId: "experts",
          consequence: "Credible voices but may find real issues.",
          requiresFollowUp: {
            question: "Which experts will you contact?",
            type: "text",
            validation: "length:150"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
