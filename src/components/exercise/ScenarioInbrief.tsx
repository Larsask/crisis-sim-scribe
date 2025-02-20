
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScenarioInbrief } from '@/types/scenario';

interface ScenarioInbriefProps {
  inbrief: ScenarioInbrief;
  onAcknowledge: () => void;
}

export const ScenarioInbrief = ({ inbrief, onAcknowledge }: ScenarioInbriefProps) => {
  return (
    <Card className="animate-in fade-in-50">
      <CardHeader>
        <CardTitle>{inbrief.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Situation Summary</h3>
          <p className="text-muted-foreground">{inbrief.summary}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Initial Situation</h3>
          <p className="text-muted-foreground">{inbrief.initialSituation}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Objectives</h3>
          <ul className="list-disc pl-5 space-y-1">
            {inbrief.objectives.map((objective, index) => (
              <li key={index} className="text-muted-foreground">{objective}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Key Stakeholders</h3>
          <ul className="list-disc pl-5 space-y-1">
            {inbrief.stakeholders.map((stakeholder, index) => (
              <li key={index} className="text-muted-foreground">{stakeholder}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Available Resources</h3>
          <ul className="list-disc pl-5 space-y-1">
            {inbrief.resources.map((resource, index) => (
              <li key={index} className="text-muted-foreground">{resource}</li>
            ))}
          </ul>
        </div>

        <Button 
          className="w-full mt-4"
          onClick={onAcknowledge}
        >
          Acknowledge & Begin Exercise
        </Button>
      </CardContent>
    </Card>
  );
};
