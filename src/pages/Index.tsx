
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { openaiTest } from "@/services/openai-test";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, PlayCircle } from "lucide-react";

export default function Index() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const testOpenAI = async () => {
    toast({
      title: "Testing OpenAI Connection",
      description: "Please wait...",
      duration: 2000,
    });

    const result = await openaiTest.testApiKey();

    toast({
      title: result.success ? "Success!" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
      duration: 5000,
    });
  };

  const startScenario = () => {
    navigate("/scenario-setup");
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Crisis Simulation</CardTitle>
          <CardDescription className="text-center">
            Test your crisis management skills in realistic scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Before starting, test the OpenAI connection:</span>
            </div>
            <Button onClick={testOpenAI} variant="outline" className="w-full">
              Test OpenAI Connection
            </Button>
          </div>

          <Button 
            onClick={startScenario} 
            className="w-full"
            size="lg"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Start New Scenario
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
