import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScenarioStore, type Complexity, type Duration } from '@/store/scenarioStore';

interface ScenarioOption {
  id: string;
  title: string;
  description: string;
  category: string;
}

const MOCK_SCENARIOS: ScenarioOption[] = [
  {
    id: "cyber-1",
    title: "Massive Data Breach",
    description: "Hackers infiltrate your company's network, stealing customer and employee data. The breach is exposed by the media before your team discovers it.",
    category: "cyberattack"
  },
  {
    id: "cyber-2",
    title: "Ransomware Lockdown",
    description: "A ransomware attack locks your entire system, including client databases and financial records. The attackers demand payment, threatening to delete all data.",
    category: "cyberattack"
  },
  {
    id: "cyber-3",
    title: "Phishing Attack on Executives",
    description: "Several executives fall victim to a phishing attack, compromising sensitive financial and legal documents. The hackers now have access to high-level decision-making.",
    category: "cyberattack"
  },
  {
    id: "cyber-4",
    title: "IoT Device Hijack",
    description: "Smart office devices (security cameras, printers, smart locks) are hijacked, disrupting operations and exposing internal communications.",
    category: "cyberattack"
  },
  {
    id: "cyber-5",
    title: "DDoS Attack on Services",
    description: "Your website and customer support systems suffer a sustained Distributed Denial-of-Service (DDoS) attack, causing service outages and customer frustration.",
    category: "cyberattack"
  },
  
  {
    id: "misinfo-1",
    title: "Viral Fake Complaints",
    description: "A series of fabricated social media complaints claim your business sells faulty products, triggering public outrage and refund requests.",
    category: "misinformation"
  },
  {
    id: "misinfo-2",
    title: "Deepfake CEO Scandal",
    description: "A deepfake video of your CEO making controversial remarks spreads online, damaging your reputation. News outlets pick up the story before you can respond.",
    category: "misinformation"
  },
  {
    id: "misinfo-3",
    title: "Competitor False Claims",
    description: "A rival business spreads misleading claims about your product's safety or ethical sourcing, eroding customer trust.",
    category: "misinformation"
  },
  {
    id: "misinfo-4",
    title: "Fake Employee Reviews",
    description: "A sudden influx of fake negative employee reviews accuses your organization of toxic work culture, deterring potential hires and damaging brand perception.",
    category: "misinformation"
  },
  {
    id: "misinfo-5",
    title: "False Crisis Hoax",
    description: "A fabricated 'leak' suggests your company is going bankrupt or shutting down, leading to a stock price drop or mass employee resignations.",
    category: "misinformation"
  },

  {
    id: "insider-1",
    title: "Leaked Financial Data",
    description: "A trusted employee sells confidential company financial records to competitors, exposing trade secrets.",
    category: "insider-threat"
  },
  {
    id: "insider-2",
    title: "Employee Sabotage",
    description: "A recently fired employee manipulates critical company systems, causing operational failures.",
    category: "insider-threat"
  },
  {
    id: "insider-3",
    title: "Contractor Espionage",
    description: "A contractor working on sensitive projects leaks designs or plans to an external party.",
    category: "insider-threat"
  },
  {
    id: "insider-4",
    title: "Social Engineering",
    description: "An employee is unknowingly recruited by a foreign entity and begins sharing internal intelligence.",
    category: "insider-threat"
  },
  {
    id: "insider-5",
    title: "Compliance Breach",
    description: "An insider deliberately bypasses security policies, causing a compliance failure and regulatory scrutiny.",
    category: "insider-threat"
  },

  {
    id: "reputation-1",
    title: "Product Safety Crisis",
    description: "A safety issue with your product/service is exposed, leading to media scrutiny and customer panic.",
    category: "reputation"
  },
  {
    id: "reputation-2",
    title: "Executive Scandal",
    description: "A senior leader is caught in a personal controversy that reflects poorly on the organization.",
    category: "reputation"
  },
  {
    id: "reputation-3",
    title: "Unethical Practices",
    description: "Leaked documents reveal unethical sourcing, labor issues, or environmental violations.",
    category: "reputation"
  },
  {
    id: "reputation-4",
    title: "Viral Service Incident",
    description: "A video of a customer receiving poor service spreads online, drawing widespread criticism.",
    category: "reputation"
  },
  {
    id: "reputation-5",
    title: "Political Backlash",
    description: "Your organization takes a stance on a controversial issue, leading to a divided customer base.",
    category: "reputation"
  },

  {
    id: "hybrid-1",
    title: "Cyber-Physical Attack",
    description: "A cyberattack shuts down smart security systems while intruders breach physical premises.",
    category: "hybrid"
  },
  {
    id: "hybrid-2",
    title: "Supply Chain Crisis",
    description: "A coordinated misinformation campaign falsely claims your supply chain is compromised, delaying shipments and panicking customers.",
    category: "hybrid"
  },
  {
    id: "hybrid-3",
    title: "Employee Activism",
    description: "Discontented employees stage a public protest while a simultaneous online campaign damages your employer brand.",
    category: "hybrid"
  },
  {
    id: "hybrid-4",
    title: "Corporate Espionage",
    description: "Hackers steal your company's research files and demand ransom, threatening to sell them to competitors.",
    category: "hybrid"
  },
  {
    id: "hybrid-5",
    title: "Regulatory Crisis",
    description: "A new government regulation impacts your industry, and activist groups exploit the moment to push a damaging narrative.",
    category: "hybrid"
  },

  {
    id: "ai-1",
    title: "AI Bias Incident",
    description: "Your AI-driven hiring system is accused of discrimination after a viral post exposes biased decisions.",
    category: "ai-powered"
  },
  {
    id: "ai-2",
    title: "Chatbot Malfunction",
    description: "Your AI-powered customer service chatbot starts generating inappropriate or misleading messages.",
    category: "ai-powered"
  },
  {
    id: "ai-3",
    title: "AI Financial Error",
    description: "An automated trading or pricing algorithm makes errors, leading to significant losses.",
    category: "ai-powered"
  },
  {
    id: "ai-4",
    title: "AI-Generated Fake News",
    description: "Deepfake technology is used to create false information attributed to your business, misleading customers.",
    category: "ai-powered"
  },
  {
    id: "ai-5",
    title: "AI System Failure",
    description: "Your AI-driven approval system causes wrongful denials, leading to lawsuits and public outrage.",
    category: "ai-powered"
  },

  {
    id: "realtime-1",
    title: "Live Security Breach",
    description: "During a high-profile product launch or corporate event, a security vulnerability is exposed in real-time.",
    category: "real-time"
  },
  {
    id: "realtime-2",
    title: "Breaking News Crisis",
    description: "A major crisis (e.g., war, natural disaster) disrupts operations, requiring an immediate response.",
    category: "real-time"
  },
  {
    id: "realtime-3",
    title: "Public Safety Incident",
    description: "A violent or hazardous incident occurs at one of your offices or stores, and the public demands action.",
    category: "real-time"
  },
  {
    id: "realtime-4",
    title: "Live Social Attack",
    description: "A coordinated effort floods your brand's social channels with negative comments and accusations during a major campaign.",
    category: "real-time"
  },
  {
    id: "realtime-5",
    title: "Fraudulent Impersonation",
    description: "A fake representative joins your virtual event, spreading misinformation to an unsuspecting audience.",
    category: "real-time"
  }
];

const COMPLEXITY_OPTIONS: Array<{ value: Complexity; label: string; description: string }> = [
  {
    value: 'simple',
    label: 'Simple',
    description: 'Clear decision points with straightforward consequences'
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Multiple variables and interconnected decisions'
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Complex scenarios with dynamic consequences'
  }
];

const DURATION_OPTIONS: Array<{ value: Duration; label: string }> = [
  { value: '30min', label: '30 Minutes' },
  { value: '1hr', label: '1 Hour' },
  { value: '2hrs', label: '2 Hours' }
];

const ScenarioSetup = () => {
  const navigate = useNavigate();
  const { 
    category, 
    setScenario,
    setComplexity, 
    setDuration,
    complexity: selectedComplexity,
    duration: selectedDuration
  } = useScenarioStore();
  
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  if (!category) {
    navigate('/');
    return null;
  }

  const availableScenarios = MOCK_SCENARIOS.filter(
    scenario => scenario.category === category
  );

  const handleStart = () => {
    if (!selectedScenario || !selectedComplexity || !selectedDuration) {
      return;
    }
    setScenario(selectedScenario);
    navigate('/exercise');
  };

  return (
    <div className="min-h-screen bg-background animate-in">
      <div className="content-container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Configure Your Exercise
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select a specific scenario, complexity level, and duration for your crisis management exercise.
          </p>
        </div>

        <div className="space-y-8">
          {/* Scenario Selection */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Choose Scenario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableScenarios.map((scenario) => (
                <Card 
                  key={scenario.id}
                  className={`cursor-pointer transition-all ${
                    selectedScenario === scenario.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedScenario(scenario.id);
                  }}
                >
                  <CardHeader>
                    <CardTitle>{scenario.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{scenario.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Complexity Selection */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Select Complexity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COMPLEXITY_OPTIONS.map((option) => (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-all ${
                    selectedComplexity === option.value ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setComplexity(option.value)}
                >
                  <CardHeader>
                    <CardTitle>{option.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Duration Selection */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Choose Duration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DURATION_OPTIONS.map((option) => (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-all ${
                    selectedDuration === option.value ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setDuration(option.value)}
                >
                  <CardHeader>
                    <CardTitle>{option.label}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Start Button */}
          <div className="flex justify-center mt-8">
            <Button
              size="lg"
              onClick={handleStart}
              disabled={!selectedScenario || !selectedComplexity || !selectedDuration}
              className="animate-in fade-in-50 duration-500"
            >
              Start Exercise
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSetup;
