
import { ScenarioStep } from '../../../types';

export const counterNarrativeStep: ScenarioStep = {
  id: 'counter-narrative',
  description: "The counter-narrative campaign is underway. Social media engagement is increasing, but some users are still skeptical.",
  options: [
    {
      text: "Host a live Q&A session",
      impact: "high",
      nextStepId: "live-qa",
      consequence: "Direct engagement can clarify doubts but may lead to tough questions.",
      requiresFollowUp: {
        question: "What topics will you cover in the Q&A?",
        type: "text",
        validation: "length:200"
      }
    },
    {
      text: "Create a series of informative videos",
      impact: "medium",
      nextStepId: "info-videos",
      consequence: "Visual content can reach a wider audience but requires time to produce.",
      requiresFollowUp: {
        question: "What key points will the videos address?",
        type: "text",
        validation: "length:150"
      }
    },
    {
      text: "Engage influencers to spread the message",
      impact: "medium",
      nextStepId: "influencer-engagement",
      consequence: "Influencers can amplify your message but may have their own agendas.",
      requiresFollowUp: {
        question: "Which influencers will you approach?",
        type: "text",
        validation: "length:100"
      }
    }
  ],
  timeLimit: 300
};
