
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface FollowUpPromptProps {
  question: string;
  type: 'text' | 'phone' | 'email' | 'time';
  validation?: string;
  onSubmit: (response: string) => void;
}

export const FollowUpPrompt = ({ question, type, validation, onSubmit }: FollowUpPromptProps) => {
  const [response, setResponse] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!response) {
      toast({
        title: "Response Required",
        description: "Please provide the requested information.",
        variant: "destructive"
      });
      return;
    }

    if (validation) {
      const [validationType, value] = validation.split(':');
      if (validationType === 'length' && response.length > parseInt(value)) {
        toast({
          title: "Response Too Long",
          description: `Please limit your response to ${value} characters.`,
          variant: "destructive"
        });
        return;
      }
    }

    onSubmit(response);
  };

  return (
    <Card className="animate-in slide-in-from-bottom">
      <CardHeader>
        <CardTitle>Additional Information Required</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{question}</p>
        <Input
          type={type === 'email' ? 'email' : 'text'}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder={`Enter ${type}`}
        />
        <Button onClick={handleSubmit} className="w-full">
          Submit Response
        </Button>
      </CardContent>
    </Card>
  );
};
