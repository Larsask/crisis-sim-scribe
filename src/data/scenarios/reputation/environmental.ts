
import { ScenarioDefinition } from '../types';

export const environmentalIncidentScenario: ScenarioDefinition = {
  id: 'reputation-4',
  category: 'reputation',
  inbrief: {
    title: "Environmental Crisis",
    summary: "A major chemical leak at your manufacturing facility has contaminated local water sources, leading to environmental concerns and community outrage.",
    objectives: [
      "Contain environmental damage",
      "Protect public health",
      "Manage community relations",
      "Handle regulatory compliance",
      "Implement corrective measures"
    ],
    stakeholders: [
      "Environmental Team",
      "Local Authorities",
      "Community Leaders",
      "PR Department",
      "Legal Team"
    ],
    resources: [
      "Emergency Response",
      "Environmental Experts",
      "Testing Equipment",
      "Community Outreach",
      "Legal Support"
    ],
    initialSituation: "At 3:15 AM, sensors detected a significant chemical leak at your main manufacturing facility. Initial reports indicate contamination of nearby groundwater. Local residents are reporting unusual odors and environmental groups are mobilizing. Media crews are arriving at the scene."
  },
  steps: [
    {
      id: 'start',
      description: "The leak is ongoing and environmental impact is growing. Local news is broadcasting live from the scene.",
      options: [
        {
          text: "Evacuate local area",
          impact: "high",
          nextStepId: "evacuation",
          consequence: "Ensures safety but escalates situation visibility.",
          requiresFollowUp: {
            question: "Define the evacuation zone and procedure:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Deploy containment team",
          impact: "high",
          nextStepId: "containment",
          consequence: "Addresses immediate threat but may take time.",
          requiresFollowUp: {
            question: "What resources will you deploy first?",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Contact environmental authorities",
          impact: "medium",
          nextStepId: "authorities",
          consequence: "Official response activated but increases scrutiny.",
          requiresFollowUp: {
            question: "What information will you provide to authorities?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180
    }
  ]
};
