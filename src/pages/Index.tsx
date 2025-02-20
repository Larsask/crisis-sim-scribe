
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScenarioStore, type ScenarioCategory } from '@/store/scenarioStore';

const CATEGORIES: Array<{
  id: ScenarioCategory;
  title: string;
  description: string;
}> = [
  {
    id: 'cyberattack',
    title: 'Cyberattack Response',
    description: 'Handle evolving cyber threats and data breaches.'
  },
  {
    id: 'misinformation',
    title: 'Misinformation Crisis',
    description: 'Combat false information spreading about your organization.'
  },
  {
    id: 'insider-threat',
    title: 'Insider Threat',
    description: 'Manage internal security compromises and employee-related incidents.'
  },
  {
    id: 'reputation',
    title: 'Reputation Management',
    description: 'Navigate public relations challenges and brand threats.'
  },
  {
    id: 'hybrid',
    title: 'Hybrid Threats',
    description: 'Handle complex scenarios involving multiple crisis types.'
  },
  {
    id: 'ai-powered',
    title: 'AI-Related Crisis',
    description: 'Respond to artificial intelligence and automation incidents.'
  },
  {
    id: 'real-time',
    title: 'Real-Time Events',
    description: 'Manage developing situations with live updates.'
  }
];

const Index = () => {
  const { setCategory } = useScenarioStore();
  const [selectedCategory, setSelectedCategory] = useState<ScenarioCategory | null>(null);

  const handleCategorySelect = (category: ScenarioCategory) => {
    setSelectedCategory(category);
    setCategory(category);
    // We'll implement navigation to scenario selection in the next step
  };

  return (
    <div className="min-h-screen bg-background animate-in">
      <div className="content-container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Crisis Simulation Exercise
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select a scenario category to begin your crisis management exercise. Each category presents unique challenges and decision points.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <Card 
              key={category.id}
              className={`transition-all duration-300 cursor-pointer hover:shadow-lg ${
                selectedCategory === category.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="w-full"
                >
                  Select Category
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
