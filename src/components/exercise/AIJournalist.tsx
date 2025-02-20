
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface AIJournalistProps {
  onResponse: (response: string) => void;
  onDecline: () => void;
}

export const AIJournalist = ({ onResponse, onDecline }: AIJournalistProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleCall = () => {
    // TODO: Implement ElevenLabs voice call
    toast({
      title: "Incoming Call",
      description: "A journalist wants to speak with you about the situation.",
    });
  };

  const handlePostpone = () => {
    setCountdown(120); // 2 minutes
    toast({
      title: "Call Postponed",
      description: "The journalist will call back in 2 minutes.",
    });
  };

  useEffect(() => {
    if (countdown === null) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleCall();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <Card className="animate-in slide-in-from-right">
      <CardHeader>
        <CardTitle>Incoming Media Call</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          {countdown !== null 
            ? `Journalist will call back in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
            : "A journalist is calling regarding the situation. How would you like to proceed?"
          }
        </p>
        <div className="space-y-2">
          <Button 
            className="w-full"
            onClick={() => setIsRecording(true)}
            disabled={isRecording || countdown !== null}
          >
            Answer Call
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handlePostpone}
            disabled={isRecording || countdown !== null}
          >
            Ask for 2 Minutes
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={onDecline}
            disabled={isRecording || countdown !== null}
          >
            Decline Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
