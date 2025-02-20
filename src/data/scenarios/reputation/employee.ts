
import { ScenarioDefinition } from '../types';

export const employeeScandalScenario: ScenarioDefinition = {
  id: 'reputation-3',
  category: 'reputation',
  inbrief: {
    title: "Senior Employee Misconduct",
    summary: "A senior executive has been caught in a scandal involving discriminatory behavior and inappropriate comments at a public event.",
    objectives: [
      "Address public concerns",
      "Maintain company values",
      "Handle internal communications",
      "Protect company reputation",
      "Implement corrective actions"
    ],
    stakeholders: [
      "HR Department",
      "Legal Team",
      "Board of Directors",
      "PR Team",
      "Employee Groups"
    ],
    resources: [
      "HR Policies",
      "PR Strategy",
      "Legal Framework",
      "Crisis Response Plan",
      "Employee Support"
    ],
    initialSituation: "Video footage has emerged showing your Chief Marketing Officer making discriminatory remarks at an industry conference. The video is trending on social media, and employee groups are demanding action. Several major clients have expressed concerns about continuing their partnerships."
  },
  steps: [
    {
      id: 'start',
      description: "The video is viral and media requests are pouring in. Internal teams are awaiting direction.",
      options: [
        {
          text: "Place executive on immediate leave",
          impact: "high",
          nextStepId: "executive-leave",
          consequence: "Shows decisive action but may admit guilt.",
          requiresFollowUp: {
            question: "Draft the internal announcement about the leave:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Launch internal investigation",
          impact: "medium",
          nextStepId: "investigation",
          consequence: "Thorough approach but may seem slow to respond.",
          requiresFollowUp: {
            question: "Define the scope of the investigation:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Issue public apology",
          impact: "high",
          nextStepId: "apology",
          consequence: "Addresses issue directly but may increase exposure.",
          requiresFollowUp: {
            question: "Write the public apology statement:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
