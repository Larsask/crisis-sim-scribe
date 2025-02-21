
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScenarioStore } from '@/store/scenarioStore';
import { useToast } from "@/components/ui/use-toast";
import { scenarios } from '@/data/scenarios';
import { ExerciseProvider } from '@/components/exercise/ExerciseProvider';
import { CrisisContainer } from '@/components/exercise/CrisisContainer';

const Exercise = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    category,
    scenarioId,
    complexity,
    duration,
  } = useScenarioStore();

  const getScenario = () => {
    const scenarioKey = Object.keys(scenarios).find(key => 
      scenarios[key].id === scenarioId && 
      scenarios[key].category === category
    );
    return scenarioKey ? scenarios[scenarioKey] : null;
  };

  const currentScenario = getScenario();

  useEffect(() => {
    if (!category || !scenarioId || !complexity || !duration) {
      navigate('/scenario-setup');
      return;
    }

    if (!currentScenario) {
      toast({
        title: "Error",
        description: "Invalid scenario selected",
        variant: "destructive"
      });
      navigate('/scenario-setup');
      return;
    }
  }, [category, scenarioId, complexity, duration, navigate, currentScenario]);

  if (!currentScenario) {
    return null;
  }

  return (
    <ExerciseProvider>
      <CrisisContainer />
    </ExerciseProvider>
  );
};

export default Exercise;
