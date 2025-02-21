import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScenarioStore, type Complexity, type Duration } from '@/store/scenarioStore';
import { scenarios } from '@/data/scenarios';
import { ScenarioDefinition } from '@/types/scenario';
import { ArrowLeft } from 'lucide-react';

interface ScenarioOption {
  id: string;
  title: string;
  description: string;
  category: string;
}

const MOCK_SCENARIOS = Object.values(scenarios).map((scenario: ScenarioDefinition) => ({
  id: scenario.id,
  title: scenario.inbrief.title,
  description: scenario.inbrief.summary,
  category: scenario.category
}));

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
        <div className="flex justify-start mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </div>
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
