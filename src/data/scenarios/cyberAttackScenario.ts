
import { ScenarioDefinition } from '@/types/scenario';

export const dataBreachScenario: ScenarioDefinition = {
  id: 'cyber-1',
  category: 'cyberattack',
  inbrief: {
    title: "Major Data Breach Incident",
    summary: "A sophisticated cyber attack has potentially compromised customer data. The situation requires immediate attention and careful crisis management.",
    objectives: [
      "Assess and contain the data breach",
      "Manage stakeholder communications",
      "Implement incident response procedures",
      "Maintain business continuity",
      "Protect company reputation"
    ],
    stakeholders: [
      "Customers",
      "Employees",
      "Media",
      "Regulatory Bodies",
      "Board of Directors",
      "Shareholders"
    ],
    resources: [
      "Internal Security Team",
      "PR Department",
      "Legal Team",
      "Customer Service Department",
      "External Cybersecurity Consultants"
    ],
    initialSituation: "It's 9:15 AM on a Tuesday. Your organization's monitoring systems have detected unusual activity in the customer database. Initial reports suggest unauthorized access to sensitive customer information. Social media is starting to show signs of customer concerns, and a journalist has already contacted your PR department."
  },
  steps: [
    {
      id: 'start',
      description: "Breaking News: A major media outlet has just reported that your company's customer database has been breached. Your phone is ringing with calls from journalists, and social media is exploding with customer concerns. Your security team is still assessing the situation.",
      options: [
        {
          text: "Issue an immediate public statement acknowledging the situation",
          impact: "medium",
          nextStepId: "media-response",
          consequence: "The quick response helps manage public perception, but some details in your statement may need to be corrected later as more information emerges.",
          requiresFollowUp: {
            question: "What key points will you include in your initial statement? (100 words max)",
            type: "text",
            validation: "length:100"
          }
        },
        {
          text: "Wait for the security team's complete assessment before making any public statements",
          impact: "high",
          nextStepId: "security-assessment",
          consequence: "The delay in response leads to increased public anxiety and speculation, but you have more accurate information to share.",
          requiresFollowUp: {
            question: "Who from the security team will you contact first?",
            type: "text"
          }
        },
        {
          text: "Contact the crisis management team",
          impact: "medium",
          nextStepId: "crisis-team",
          consequence: "The team begins mobilizing, but response time varies based on availability.",
          requiresFollowUp: {
            question: "Provide the direct phone number for your crisis team leader:",
            type: "phone"
          }
        }
      ],
      timeLimit: 300, // 5 minutes
      aiEscalation: [
        "Social media mentions have doubled in the last 5 minutes.",
        "A major news network is preparing to run a prime-time story.",
        "Customer support lines are being overwhelmed with calls."
      ]
    },
    {
      id: 'media-response',
      description: "Your initial statement has been released. While it demonstrates transparency, journalists are demanding specific details about the breach. Meanwhile, your security team reports potential ongoing unauthorized access to systems.",
      isJournalistCall: true,
      options: [
        {
          text: "Share detailed technical information about the breach",
          impact: "high",
          nextStepId: "technical-details",
          consequence: "The transparency builds trust but may provide attackers with useful information."
        },
        {
          text: "Engage a crisis management firm",
          impact: "medium",
          nextStepId: "crisis-management",
          consequence: "Professional guidance helps structure your response, but adds to response time.",
          requiresFollowUp: {
            question: "Which crisis management firm will you contact?",
            type: "text"
          }
        },
        {
          text: "Focus on immediate customer protection measures",
          impact: "low",
          nextStepId: "customer-protection",
          consequence: "Customers appreciate the protective measures, but media criticism of transparency continues."
        }
      ],
      timeLimit: 180
    },
    // ... Add more steps
  ]
};

// Add more scenarios here
