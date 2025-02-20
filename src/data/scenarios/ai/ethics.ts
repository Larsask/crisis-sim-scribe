
import { ScenarioDefinition } from '../types';

export const aiEthicsScenario: ScenarioDefinition = {
  id: 'ai-5',
  category: 'ai-powered',
  inbrief: {
    title: "AI Ethics Crisis",
    summary: "Your AI healthcare system has been found making biased treatment recommendations, potentially discriminating against certain patient groups.",
    objectives: [
      "Stop discriminatory decisions",
      "Assess impact on patients",
      "Review AI algorithms",
      "Implement safeguards",
      "Address public concerns"
    ],
    stakeholders: [
      "Medical Team",
      "Ethics Committee",
      "AI Developers",
      "Patient Advocates",
      "Hospital Board"
    ],
    resources: [
      "Treatment Data",
      "AI Model Access",
      "Ethics Framework",
      "Patient Records",
      "Audit Tools"
    ],
    initialSituation: "Analysis reveals that your AI healthcare system has been showing systematic bias in treatment recommendations based on socioeconomic factors. The system has been operational for 6 months and has influenced decisions for approximately 10,000 patients."
  },
  steps: [
    {
      id: 'start',
      description: "The AI system continues to make recommendations. Medical staff are requesting guidance on how to proceed with patient care.",
      options: [
        {
          text: "Suspend AI recommendations",
          impact: "high",
          nextStepId: "suspend",
          consequence: "Stops bias but disrupts care workflow.",
          requiresFollowUp: {
            question: "Detail alternative decision process:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Implement bias detection",
          impact: "medium",
          nextStepId: "detect",
          consequence: "Identifies issues but may miss subtle bias.",
          requiresFollowUp: {
            question: "Define bias detection parameters:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Review affected cases",
          impact: "high",
          nextStepId: "review",
          consequence: "Thorough but time-consuming.",
          requiresFollowUp: {
            question: "Outline case review methodology:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
