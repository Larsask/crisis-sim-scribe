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
    }
  ]
};

export const insiderThreatScenario: ScenarioDefinition = {
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

export const socialEngineeringScenario: ScenarioDefinition = {
  id: 'insider-2',
  category: 'insider-threat',
  inbrief: {
    title: "CEO Account Compromise",
    summary: "Your CEO's email account is showing unusual activity after a sophisticated social engineering attack. The attacker has gained access and is now sending authoritative emails to various departments.",
    objectives: [
      "Identify compromised systems",
      "Prevent unauthorized transactions",
      "Contain email-based threats",
      "Establish authentic communication channels",
      "Prevent further social engineering attempts"
    ],
    stakeholders: [
      "Executive Team",
      "IT Security",
      "Finance Department",
      "Communications Team",
      "All Employees"
    ],
    resources: [
      "Email Security Tools",
      "Authentication Systems",
      "Emergency Communication Channels",
      "Incident Response Team",
      "Digital Forensics Tools"
    ],
    initialSituation: "At 10:30 AM, multiple department heads report receiving unusual email requests from the CEO's account. The emails request urgent wire transfers and sensitive employee data. The CEO is currently on a flight and unreachable. Initial investigation suggests a sophisticated social engineering attack preceded this incident."
  },
  steps: [
    {
      id: 'start',
      description: "Finance reports an urgent wire transfer request for $2.5M from the CEO's email. HR has received requests for employee tax information. Both departments are awaiting confirmation.",
      options: [
        {
          text: "Implement immediate email quarantine",
          impact: "high",
          nextStepId: "email-quarantine",
          consequence: "All executive emails are now quarantined, but this affects legitimate business communications.",
          requiresFollowUp: {
            question: "Detail the exact quarantine parameters and how to handle critical business communications:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Issue emergency all-staff notification",
          impact: "medium",
          nextStepId: "staff-notification",
          consequence: "Staff alerted, but this could tip off the attacker and cause them to escalate.",
          requiresFollowUp: {
            question: "Write the exact text of the emergency notification, considering panic prevention:",
            type: "text",
            validation: "length:250"
          }
        },
        {
          text: "Contact the CEO's executive assistant",
          impact: "medium",
          nextStepId: "assistant-contact",
          consequence: "Assistant engaged but needs verification protocols.",
          requiresFollowUp: {
            question: "What specific questions will you ask to verify the assistant's identity and establish secure communication?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 300,
      aiEscalation: [
        "New urgent emails appearing in multiple departments.",
        "Attempts to access VPN detected from unknown locations.",
        "Social media post drafts detected in CEO's account."
      ]
    }
  ]
};
