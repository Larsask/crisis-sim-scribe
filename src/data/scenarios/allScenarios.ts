import { ScenarioDefinition } from '@/types/scenario';

export const cyberAttackScenario: ScenarioDefinition = {
  id: 'cyber-1',
  category: 'cyberattack',
  inbrief: {
    title: "Ransomware Crisis",
    summary: "A sophisticated ransomware attack has encrypted critical systems across multiple offices. The attackers are demanding payment in cryptocurrency, threatening to delete all data.",
    objectives: [
      "Contain the ransomware spread",
      "Assess system compromise scope",
      "Evaluate backup integrity",
      "Manage stakeholder communications",
      "Determine response strategy"
    ],
    stakeholders: [
      "IT Security Team",
      "Executive Board",
      "Legal Department",
      "Insurance Provider",
      "Law Enforcement"
    ],
    resources: [
      "Incident Response Team",
      "Backup Systems",
      "Cyber Insurance Policy",
      "External Security Consultants",
      "Emergency Communication Channels"
    ],
    initialSituation: "At 6:30 AM, the IT team detected widespread system encryption across your network. A ransom note demands 50 Bitcoin within 48 hours. Initial reports show 60% of systems are affected, including customer databases and financial records."
  },
  steps: [
    {
      id: 'start',
      description: "Systems are being encrypted in real-time. The ransomware is spreading through the network. Your team needs immediate direction.",
      options: [
        {
          text: "Initiate complete network shutdown",
          impact: "high",
          nextStepId: "network-shutdown",
          consequence: "Network shutdown stops the spread but halts all operations.",
          requiresFollowUp: {
            question: "Specify the shutdown sequence and critical systems to keep online:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Begin backup restoration",
          impact: "medium",
          nextStepId: "backup-restore",
          consequence: "Restoration started but takes time and may not cover recent data.",
          requiresFollowUp: {
            question: "Prioritize which systems to restore first and explain why:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Contact ransomware negotiation service",
          impact: "high",
          nextStepId: "negotiation",
          consequence: "Negotiators engaged but this signals willingness to pay.",
          requiresFollowUp: {
            question: "What specific information will you share with the negotiators?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 300
    }
  ]
};

export const misinformationScenario: ScenarioDefinition = {
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
    }
  ]
};

export const reputationScenario: ScenarioDefinition = {
  id: 'reputation-1',
  category: 'reputation',
  inbrief: {
    title: "Executive Misconduct Scandal",
    summary: "A video showing your CFO making inappropriate comments about customers and revealing potential financial misconduct has been leaked. The video is from a private executive meeting and is spreading rapidly.",
    objectives: [
      "Verify video authenticity",
      "Manage public perception",
      "Address stakeholder concerns",
      "Handle regulatory implications",
      "Implement damage control"
    ],
    stakeholders: [
      "Board of Directors",
      "Shareholders",
      "Employees",
      "Media Relations",
      "Regulatory Bodies"
    ],
    resources: [
      "Crisis PR Team",
      "Legal Counsel",
      "Financial Auditors",
      "HR Department",
      "Corporate Communications"
    ],
    initialSituation: "The video was posted 30 minutes ago and has already reached major news networks. Stock price is dropping, and #CompanyScandal is trending. The CFO is currently unreachable."
  },
  steps: [
    {
      id: 'start',
      description: "The board is demanding immediate action, shareholders are calling, and reporters are flooding your PR department.",
      options: [
        {
          text: "Suspend CFO pending investigation",
          impact: "high",
          nextStepId: "cfo-suspension",
          consequence: "Action shows decisiveness but may imply guilt.",
          requiresFollowUp: {
            question: "Draft the official suspension announcement:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Commission emergency audit",
          impact: "medium",
          nextStepId: "audit",
          consequence: "Audit initiated but suggests potential systemic issues.",
          requiresFollowUp: {
            question: "Define the scope and timeline for the emergency audit:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Hold emergency board meeting",
          impact: "high",
          nextStepId: "board-meeting",
          consequence: "Board convened but delays public response.",
          requiresFollowUp: {
            question: "Prepare the board meeting agenda with key discussion points:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 180,
      isJournalistCall: true
    }
  ]
};

export const aiPoweredScenario: ScenarioDefinition = {
  id: 'ai-1',
  category: 'ai-powered',
  inbrief: {
    title: "AI System Ethical Crisis",
    summary: "Your company's AI-powered hiring system has been found to show significant bias against certain demographic groups. An investigation reveals concerning patterns in its decision-making process.",
    objectives: [
      "Assess AI system bias",
      "Address discrimination concerns",
      "Review affected applications",
      "Implement corrective measures",
      "Rebuild public trust"
    ],
    stakeholders: [
      "AI Development Team",
      "HR Department",
      "Legal Team",
      "Affected Applicants",
      "Ethics Board"
    ],
    resources: [
      "AI Audit Tools",
      "HR Records",
      "Ethics Guidelines",
      "Technical Documentation",
      "PR Response Team"
    ],
    initialSituation: "A data scientist's analysis reveals your AI hiring system has been showing a 35% bias against certain demographics. The findings are about to be published in a major tech journal."
  },
  steps: [
    {
      id: 'start',
      description: "The technical team confirms the bias. Legal warns of potential discrimination lawsuits. HR is reviewing thousands of potentially affected applications.",
      options: [
        {
          text: "Shut down AI system immediately",
          impact: "high",
          nextStepId: "system-shutdown",
          consequence: "System halted but disrupts ongoing hiring processes.",
          requiresFollowUp: {
            question: "Detail the transition plan for current hiring processes:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Launch comprehensive audit",
          impact: "medium",
          nextStepId: "audit",
          consequence: "Audit started but may reveal more issues.",
          requiresFollowUp: {
            question: "Define the specific parameters for the AI audit:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Contact affected applicants",
          impact: "high",
          nextStepId: "applicant-contact",
          consequence: "Transparency shown but opens legal exposure.",
          requiresFollowUp: {
            question: "Draft the message to affected applicants:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 240
    }
  ]
};

export const hybridScenario: ScenarioDefinition = {
  id: 'hybrid-1',
  category: 'hybrid',
  inbrief: {
    title: "Supply Chain Cyber-Sabotage",
    summary: "A sophisticated attack combines physical tampering with cyber intrusion in your supply chain. Critical shipments are being redirected while system logs are altered to hide the changes.",
    objectives: [
      "Trace compromised shipments",
      "Identify attack vectors",
      "Secure supply chain",
      "Detect insider involvement",
      "Restore system integrity"
    ],
    stakeholders: [
      "Security Team",
      "Logistics Department",
      "Supply Chain Partners",
      "Customers",
      "Law Enforcement"
    ],
    resources: [
      "Tracking Systems",
      "Security Cameras",
      "Access Logs",
      "Partner Network",
      "Forensics Team"
    ],
    initialSituation: "Multiple high-value shipments have deviated from their routes. Security systems show no unauthorized access, but physical inventory doesn't match digital records."
  },
  steps: [
    {
      id: 'start',
      description: "Three more shipments just disappeared from tracking. Security footage has been tampered with. A suspicious pattern in employee access cards is detected.",
      options: [
        {
          text: "Lock down all shipping operations",
          impact: "high",
          nextStepId: "lockdown",
          consequence: "Operations halted but prevents further losses.",
          requiresFollowUp: {
            question: "Specify which operations to freeze and which to maintain:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Deploy physical security teams",
          impact: "medium",
          nextStepId: "security-teams",
          consequence: "Teams deployed but coverage is limited.",
          requiresFollowUp: {
            question: "Prioritize security team deployment locations and tasks:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Activate backup tracking system",
          impact: "high",
          nextStepId: "backup-tracking",
          consequence: "Backup system online but may be compromised.",
          requiresFollowUp: {
            question: "List critical parameters to monitor in the backup system:",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 300
    }
  ]
};

export const realTimeScenario: ScenarioDefinition = {
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
      description: "The senior engineer's workstation is flagged for suspicious activity. Security teams are investigating.",
      options: [
        {
          text: "Lock down workstation",
          impact: "high",
          nextStepId: "lockdown",
          consequence: "Workstation is secured but may disrupt ongoing work.",
          requiresFollowUp: {
            question: "Specify which systems to freeze and which to maintain:",
            type: "text",
            validation: "length:200"
          }
        },
        {
          text: "Deploy forensic team",
          impact: "medium",
          nextStepId: "forensic-team",
          consequence: "Forensic team deployed but may take time.",
          requiresFollowUp: {
            question: "Define the scope and timeline for the forensic investigation:",
            type: "text",
            validation: "length:150"
          }
        },
        {
          text: "Contact HR and legal",
          impact: "high",
          nextStepId: "contact-hr-legal",
          consequence: "HR and legal are informed but may delay response.",
          requiresFollowUp: {
            question: "What specific information will you share with HR and legal?",
            type: "text",
            validation: "length:200"
          }
        }
      ],
      timeLimit: 120
    }
  ]
};

export const scenarios = {
  cyberAttackScenario,
  misinformationScenario,
  reputationScenario,
  aiPoweredScenario,
  hybridScenario,
  realTimeScenario,
  insiderThreatScenario
};
