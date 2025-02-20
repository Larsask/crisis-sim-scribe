
import { ScenarioDefinition } from '../types';

export const productDisinfoScenario: ScenarioDefinition = {
  id: 'misinfo-4',
  category: 'misinformation',
  inbrief: {
    title: "Product Safety Misinformation",
    summary: "Viral social media posts claim your flagship product has dangerous defects. Users are sharing edited videos showing apparent malfunctions.",
    objectives: [
      "Verify product safety",
      "Counter false claims",
      "Support customers",
      "Document evidence",
      "Protect brand image"
    ],
    stakeholders: [
      "Quality Assurance",
      "Customer Support",
      "PR Team",
      "Legal Department",
      "Social Media Team"
    ],
    resources: [
      "Safety Reports",
      "Testing Data",
      "Customer Feedback",
      "Video Analysis",
      "Expert Network"
    ],
    initialSituation: "Multiple viral videos showing alleged product malfunctions have accumulated millions of views. Customer support is overwhelmed with inquiries."
  },
  steps: [
    {
      id: 'start',
      description: "Videos of alleged malfunctions are trending. Customers are demanding answers.",
      options: [
        {
          text: "Release product testing footage",
          impact: "high",
          nextStepId: "testing",
          consequence: "Shows transparency but technical details may confuse.",
          requiresFollowUp: {
            question: "What footage will you release?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Offer free safety inspections",
          impact: "medium",
          nextStepId: "inspections",
          consequence: "Builds trust but implies possible issues.",
          requiresFollowUp: {
            question: "How will you handle the inspection process?",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Create debunking videos",
          impact: "high",
          nextStepId: "debunk",
          consequence: "Direct response but may amplify false claims.",
          requiresFollowUp: {
            question: "What points will your videos address?",
            type: "text",
            validation: "length:150"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
