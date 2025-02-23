
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScenarioStore, ScenarioCategory } from '@/store/scenarioStore';
import { scenarios } from '@/data/scenarios';
import { ArrowLeft } from 'lucide-react';

// Categories for the crisis simulation with proper typing
const CATEGORIES: Array<{
  id: ScenarioCategory;
  name: string;
  description: string;
}> = [
  {
    id: 'cyberattack',
    name: 'Cyber Attacks',
    description: 'Handle cybersecurity incidents and data breaches'
  },
  {
    id: 'ai-powered',
    name: 'AI Incidents',
    description: 'Manage crises involving AI systems and automation'
  },
  {
    id: 'insider-threat',
    name: 'Insider Threats',
    description: 'Address internal security and trust violations'
  },
  {
    id: 'misinformation',
    name: 'Misinformation',
    description: 'Combat false information and protect reputation'
  },
  {
    id: 'reputation',
    name: 'Reputation',
    description: 'Handle PR crises and stakeholder trust issues'
  },
  {
    id: 'real-time',
    name: 'Real-Time Events',
    description: 'Respond to ongoing operational incidents'
  },
  {
    id: 'hybrid',
    name: 'Hybrid Threats',
    description: 'Handle complex multi-vector incidents'
  }
];

const ScenarioSetup = () => {
  const navigate = useNavigate();
  const { 
    setCategory, 
    setScenario,
    setComplexity, 
    setDuration,
    complexity: selectedComplexity,
    duration: selectedDuration
  } = useScenarioStore();
  
  const [selectedCategory, setSelectedCategory] = useState<ScenarioCategory | null>(null);

  const handleCategorySelect = (categoryId: ScenarioCategory) => {
    setSelectedCategory(categoryId);
    setCategory(categoryId);
  };

  const handleStart = () => {
    if (!selectedCategory || !selectedComplexity || !selectedDuration) {
      return;
    }
    // Set first scenario of selected category as default
    const categoryScenarios = Object.values(scenarios).filter(
      scenario => scenario.category === selectedCategory
    );
    if (categoryScenarios.length > 0) {
      setScenario(categoryScenarios[0].id);
    }
    navigate('/exercise');
  };

  return (
    <div className="min-h-screen bg-background animate-in">
      <div className="container py-12">
        <div className="flex justify-start mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Select Crisis Category
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose a category, complexity level, and duration for your crisis management exercise.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {CATEGORIES.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Complexity Selection */}
        {selectedCategory && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Select Complexity</h2>
            <div className="flex gap-4">
              {['simple', 'moderate', 'advanced'].map((level) => (
                <Button
                  key={level}
                  variant={selectedComplexity === level ? 'default' : 'outline'}
                  onClick={() => setComplexity(level as 'simple' | 'moderate' | 'advanced')}
                  className="flex-1"
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Duration Selection */}
        {selectedCategory && selectedComplexity && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Choose Duration</h2>
            <div className="flex gap-4">
              {[
                { value: '30min', label: '30 Minutes' },
                { value: '1hr', label: '1 Hour' },
                { value: '2hrs', label: '2 Hours' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={selectedDuration === option.value ? 'default' : 'outline'}
                  onClick={() => setDuration(option.value as '30min' | '1hr' | '2hrs')}
                  className="flex-1"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            onClick={handleStart}
            disabled={!selectedCategory || !selectedComplexity || !selectedDuration}
            className="min-w-[200px]"
          >
            Start Exercise
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSetup;
