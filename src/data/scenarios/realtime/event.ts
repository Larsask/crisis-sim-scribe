import { ScenarioDefinition } from '../types';

export const liveEventScenario: ScenarioDefinition = {
  id: 'realtime-1',
  category: 'real-time',
  inbrief: {
    title: "Live Event Security Breach",
    summary: "During a major product launch livestream, hackers have gained control of the presentation systems and are threatening to expose confidential information to millions of viewers.",
    objectives: [
      "Maintain broadcast control",
      "Protect confidential data",
      "Manage live audience",
      "Trace intrusion source",
      "Preserve brand image"
    ],
    stakeholders: [
      "Technical Team",
      "Executive Presenters",
      "PR Department",
      "Security Team",
      "Global Audience"
    ],
    resources: [
      "Backup Systems",
      "Crisis Team",
      "Communication Channels",
      "Security Protocols",
      "Technical Support"
    ],
    initialSituation: "Your company's biggest product launch of the year is live with 2 million viewers. Hackers have just hijacked the presentation slides and are threatening to expose trade secrets in 5 minutes."
  },
  steps: [
    {
      id: 'start',
      description: "The hackers have started a countdown. Your CEO is mid-presentation. Social media is exploding with speculation.",
      options: [
        {
          text: "Cut the livestream immediately",
          impact: "high",
          nextStepId: "stream-cut",
          consequence: "Stream ended but creates massive uncertainty.",
          requiresFollowUp: {
            question: "Draft an immediate statement for the 2 million viewers:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Switch to backup presentation system",
          impact: "medium",
          nextStepId: "backup-system",
          consequence: "Backup ready but transition may be visible.",
          requiresFollowUp: {
            question: "Coordinate the exact timing and method of transition:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Negotiate with hackers",
          impact: "high",
          nextStepId: "negotiation",
          consequence: "Communication opened but validates threat.",
          requiresFollowUp: {
            question: "What terms are you willing to discuss with the hackers?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180,
      isJournalistCall: true
    },
    {
      id: 'stream-cut',
      description: "The livestream has been cut. Viewers are confused and angry. Social media is rife with speculation about the company's transparency.",
      options: [
        {
          text: "Issue a public apology and explain the situation",
          impact: "high",
          nextStepId: "public-apology",
          consequence: "The apology may help regain trust but could also be seen as an admission of failure."
        },
        {
          text: "Provide a brief update on the situation",
          impact: "medium",
          nextStepId: "situation-update",
          consequence: "The update calms some viewers but leaves many questions unanswered."
        },
        {
          text: "Ignore the social media outcry for now",
          impact: "low",
          nextStepId: "ignore-outcry",
          consequence: "Ignoring the outcry may lead to further backlash and loss of credibility."
        }
      ],
      timeLimit: 120
    },
    {
      id: 'backup-system',
      description: "The backup system is now live, but viewers noticed the transition. The hackers are still threatening to release sensitive information.",
      options: [
        {
          text: "Launch a counter-cyber operation against the hackers",
          impact: "high",
          nextStepId: "counter-operation",
          consequence: "The operation may deter the hackers but could escalate the situation."
        },
        {
          text: "Engage with cybersecurity experts for advice",
          impact: "medium",
          nextStepId: "cyber-experts",
          consequence: "Expert advice may help, but time is of the essence."
        },
        {
          text: "Focus on damage control and prepare a statement",
          impact: "low",
          nextStepId: "damage-control",
          consequence: "Damage control is essential, but it may not address the immediate threat."
        }
      ],
      timeLimit: 240
    },
    {
      id: 'negotiation',
      description: "Negotiations with the hackers are underway. They demand a ransom in exchange for not releasing the information.",
      options: [
        {
          text: "Agree to their demands",
          impact: "high",
          nextStepId: "agree-demands",
          consequence: "Paying the ransom may prevent immediate harm but sets a dangerous precedent."
        },
        {
          text: "Refuse to negotiate and escalate security measures",
          impact: "medium",
          nextStepId: "escalate-security",
          consequence: "Refusing to negotiate may provoke the hackers further."
        },
        {
          text: "Attempt to trace the hackers' location",
          impact: "low",
          nextStepId: "trace-hackers",
          consequence: "Tracing may provide valuable information but takes time."
        }
      ],
      timeLimit: 180
    }
  ]
};
