
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { openaiTest } from "@/services/openai-test";

export default function Index() {
  const { toast } = useToast();

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

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Crisis Simulation</h1>
      <div className="space-y-4">
        <Button onClick={testOpenAI} variant="outline" className="w-full">
          Test OpenAI Connection
        </Button>
      </div>
    </div>
  );
}
