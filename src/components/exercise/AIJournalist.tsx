
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';

interface AIJournalistProps {
  onResponse: (response: string) => void;
  onDecline: () => void;
}

interface SecretData {
  name: string;
  value: string;
}

export const AIJournalist = ({ onResponse, onDecline }: AIJournalistProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [response, setResponse] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    if (audioUrl) {
      audio = new Audio(audioUrl);
      audio.play();
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.remove();
      }
    };
  }, [audioUrl]);

  const handleCall = async () => {
    setIsLoading(true);
    try {
      // Get the API key from Supabase using RPC call
      const { data: secretData, error: secretError } = await supabase
        .rpc('get_secret', { secret_name: 'ELEVENLABS_API_KEY' });

      if (secretError || !secretData) {
        throw new Error('Failed to retrieve API key');
      }

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': secretData
        },
        body: JSON.stringify({
          text: "This is Sarah Chen from Global News. We've received reports about the ongoing situation at your company. Can you confirm the details and provide an official statement?",
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setIsRecording(true);

    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: "Error",
        description: "Failed to connect with the journalist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitResponse = () => {
    if (!response.trim()) {
      toast({
        title: "Response Required",
        description: "Please provide a response to the journalist.",
        variant: "destructive"
      });
      return;
    }
    onResponse(response);
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
        {isRecording && (
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your response to the journalist..."
            className="min-h-[100px]"
          />
        )}
        <div className="space-y-2">
          <Button 
            className="w-full"
            onClick={handleCall}
            disabled={isRecording || countdown !== null || isLoading}
          >
            {isLoading ? "Connecting..." : "Answer Call"}
          </Button>
          {isRecording && (
            <Button 
              className="w-full"
              onClick={handleSubmitResponse}
            >
              Submit Response
            </Button>
          )}
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
