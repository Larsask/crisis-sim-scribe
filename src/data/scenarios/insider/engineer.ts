import { ScenarioDefinition } from '../types';

export const engineerThreatScenario: ScenarioDefinition = {
  id: 'insider-1',
  category: 'insider-threat',
  inbrief: {
    title: "Suspicious Employee Activity Alert",
    summary: "A senior engineer with privileged access has been detected transferring large amounts of proprietary data outside normal working hours. The activity suggests potential intellectual property theft.",
    objectives: [
      "Identify scope of compromised data",
      "Preserve evidence for investigation",
      "Minimize data exfiltration",
      "Maintain operational security",
      "Prepare legal response"
    ],
    stakeholders: [
      "IT Security Team",
      "Human Resources",
      "Legal Department",
      "Executive Management",
      "Affected Department Heads"
    ],
    resources: [
      "Security Monitoring Tools",
      "Access Logs",
      "HR Records",
      "Legal Team",
      "Digital Forensics Team"
    ],
    initialSituation: "It's 3:45 AM when your security monitoring system flags suspicious data transfers from a senior engineer's workstation. The employee in question, Dr. Sarah Chen, has been with the company for 8 years and leads critical R&D projects. Initial logs show large data transfers to external storage devices and unusual access patterns to sensitive project files."
  },
  steps: [
    {
      id: 'start',
      description: "The monitoring system shows ongoing data transfers. Dr. Chen's credentials are actively accessing multiple restricted databases. You must act quickly while maintaining the integrity of potential evidence.",
      options: [
        {
          text: "Immediately revoke all access credentials",
          impact: "high",
          nextStepId: "access-revoked",
          consequence: "Access revoked, but this action alerts the employee and could compromise the investigation.",
          requiresFollowUp: {
            question: "Specify which exact systems you're revoking access to and in what order:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Begin covert monitoring while gathering evidence",
          impact: "medium",
          nextStepId: "covert-monitoring",
          consequence: "Monitoring initiated, but data continues to be at risk.",
          requiresFollowUp: {
            question: "Name the specific team members you'll involve in the covert operation and their roles:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Contact Dr. Chen's supervisor immediately",
          impact: "medium",
          nextStepId: "supervisor-contact",
          consequence: "The supervisor is notified but this could tip off the employee if not handled carefully.",
          requiresFollowUp: {
            question: "What exact words will you use to brief the supervisor? Consider legal implications:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180,
      aiEscalation: [
        "Additional file transfers detected to new locations.",
        "Employee's virtual private network connection just activated.",
        "Attempts to access encrypted project archives detected."
      ]
    },
    {
      id: 'covert-monitoring',
      description: "Your team has established covert monitoring. They've detected Dr. Chen is currently online and accessing the quantum computing project files. A draft email to a competitor is found in her outbox.",
      isJournalistCall: false,
      options: [
        {
          text: "Deploy digital forensics team",
          impact: "high",
          nextStepId: "forensics-deployed",
          consequence: "Forensics team begins collecting evidence but requires specific authorization levels.",
          requiresFollowUp: {
            question: "List the specific forensics procedures to be implemented, in order of priority:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Prepare for immediate apprehension",
          impact: "high",
          nextStepId: "apprehension-prep",
          consequence: "Security team mobilized, but this requires careful coordination with legal and HR.",
          requiresFollowUp: {
            question: "Detail the exact steps for the apprehension plan, including timing and personnel:",
            type: "text",
            validation: "length:250"
          }
        },
        {
          text: "Initiate emergency project lockdown",
          impact: "medium",
          nextStepId: "project-lockdown",
          consequence: "Critical projects secured but this will affect ongoing operations.",
          requiresFollowUp: {
            question: "Specify which projects to lock down and how to maintain essential operations:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};
