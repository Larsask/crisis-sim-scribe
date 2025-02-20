import { ScenarioDefinition } from '../types';

export const viralDisinfoScenario: ScenarioDefinition = {
  id: 'misinfo-1',
  category: 'misinformation',
  inbrief: {
    title: "Viral Disinformation Campaign",
    summary: "A coordinated disinformation campaign falsely claims your company's products cause severe health issues. The claims are spreading rapidly on social media with seemingly credible but fabricated evidence.",
    objectives: [
      "Verify facts and evidence",
      "Counter false narratives",
      "Protect brand reputation",
      "Support affected stakeholders",
      "Document misinformation sources"
    ],
    stakeholders: [
      "PR Team",
      "Legal Department",
      "Product Safety Team",
      "Social Media Team",
      "Customer Support"
    ],
    resources: [
      "Product Safety Data",
      "Media Monitoring Tools",
      "Crisis Communication Plan",
      "External PR Agency",
      "Social Media Dashboard"
    ],
    initialSituation: "A viral post claiming your product caused severe allergic reactions has gained 1 million shares in 3 hours. Manufactured lab reports and fake customer testimonials are being circulated. News media is starting to pick up the story."
  },
  steps: [
    {
      id: 'start',
      description: "The hashtag #ProductSafety is trending, and a news network is preparing a prime-time story. Your PR team needs direction on the response strategy.",
      options: [
        {
          text: "Release comprehensive safety data",
          impact: "high",
          nextStepId: "safety-data",
          consequence: "Data published but technical nature may confuse public.",
          requiresFollowUp: {
            question: "How will you present the technical data in an accessible way?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Launch counter-narrative campaign",
          impact: "medium",
          nextStepId: "counter-narrative",
          consequence: "Campaign starts but might fuel more controversy.",
          requiresFollowUp: {
            question: "Draft the key messages for your counter-narrative:",
            type: "text",
            validation: "length:250"
          }
        },
        {
          text: "Engage fact-checking organizations",
          impact: "high",
          nextStepId: "fact-check",
          consequence: "Fact-checkers engaged but verification takes time.",
          requiresFollowUp: {
            question: "What evidence will you provide to fact-checkers?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    },
    {
      id: 'safety-data',
      description: "Your safety data has been released. The media is now asking for more details about the product's safety testing.",
      options: [
        {
          text: "Provide detailed testing results",
          impact: "high",
          nextStepId: "detailed-results",
          consequence: "Transparency builds trust but may reveal vulnerabilities.",
          requiresFollowUp: {
            question: "What specific results will you share?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Limit information to general statements",
          impact: "medium",
          nextStepId: "general-statements",
          consequence: "Less detailed but avoids revealing sensitive information.",
          requiresFollowUp: {
            question: "What general statements will you make?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Decline to comment further",
          impact: "low",
          nextStepId: "no-comment",
          consequence: "Avoids risk but may frustrate stakeholders.",
          requiresFollowUp: {
            question: "How will you communicate this decision?",
            type: "text",
            validation: "length:100"
          }
        }
      ],
      timeLimit: 180
    },
    {
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
    },
    {
      id: 'fact-check',
      description: "Fact-checkers are reviewing your claims. You need to prepare for potential backlash if they find discrepancies.",
      options: [
        {
          text: "Prepare a detailed response plan",
          impact: "high",
          nextStepId: "response-plan",
          consequence: "Being proactive can mitigate damage but requires resources.",
          requiresFollowUp: {
            question: "What key points will your response cover?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Wait for their findings before responding",
          impact: "medium",
          nextStepId: "wait-findings",
          consequence: "Allows for accurate information but risks losing control of the narrative.",
          requiresFollowUp: {
            question: "How will you monitor their progress?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Discredit the fact-checkers",
          impact: "high",
          nextStepId: "discredit",
          consequence: "Could rally support but may backfire if not handled carefully.",
          requiresFollowUp: {
            question: "What evidence will you use to discredit them?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    },
    {
      id: 'detailed-results',
      description: "The detailed testing results have been shared. The media is now asking for a follow-up interview.",
      options: [
        {
          text: "Agree to the interview",
          impact: "high",
          nextStepId: "interview-agreed",
          consequence: "Opportunity to clarify but risks further scrutiny.",
          requiresFollowUp: {
            question: "Who will represent the company in the interview?",
            type: "text",
            validation: "length:100"
          }
        },
        {
          text: "Decline the interview",
          impact: "medium",
          nextStepId: "interview-declined",
          consequence: "Avoids risk but may appear evasive.",
          requiresFollowUp: {
            question: "How will you communicate this decision?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Offer a written statement instead",
          impact: "medium",
          nextStepId: "written-statement",
          consequence: "Provides control over the message but lacks personal touch.",
          requiresFollowUp: {
            question: "What will the statement include?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
