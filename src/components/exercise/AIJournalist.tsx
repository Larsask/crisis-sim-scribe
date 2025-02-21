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

export const AIJournalist = ({ onResponse, onDecline }: AIJournalistProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [callSessionId, setCallSessionId] = useState<string | null>(null);
  const [aiReply, setAiReply] = useState<string>('');

  // Fetch API Key from Supabase
  const fetchApiKey = async () => {
    const { data, error } = await supabase.rpc('get_secret', { secret_name: 'ELEVENLABS_API_KEY' });

    if (error || !data || !Array.isArray(data) || data.length === 0 || !data[0].value) {
      console.error('Failed to retrieve API key:', error || 'No data returned');
      toast({
        title: "Error",
        description: "Failed to retrieve ElevenLabs API key. Please check your Supabase settings.",
        variant: "destructive"
      });
      return null;
    }
    return data[0].value;
  };

  // Function to start AI Call
  const handleCall = async () => {
    setIsLoading(true);
    try {
      const apiKey = await fetchApiKey();
      if (!apiKey) return;

      // Start a new conversation with the AI journalist
      const response = await fetch('https://api.elevenlabs.io/v1/conversational-agent/start-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          agent_id: "kvR20HsbaSdUrbclBOzA", // Your ElevenLabs Agent ID
          prompt: "This is Jimmy Slider from Global News. We've received reports about the ongoing situation at your company. Can you confirm the details and provide an official statement?",
          settings: {
            voice: "Alloy",
            temperature: 0.7
          }
        })
      });

      if (!response.ok) throw new Error('Failed to start AI call');

      const data = await response.json();
      setCallSessionId(data.session_id); // Store session ID for tracking conversation
      setIsRecording(true);

    } catch (error) {
      console.error('Error initiating call:', error);
      toast({
        title: "Error",
        description: "Failed to start AI journalist call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to send user response to AI
  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      toast({
        title: "Response Required",
        description: "Please provide a response to the journalist.",
        variant: "destructive"
      });
      return;
    }
    if (!callSessionId) {
      toast({
        title: "Error",
        description: "No active AI call session found.",
        variant: "destructive"
      });
      return;
    }

    try {
      const apiKey = await fetchApiKey();
      if (!apiKey) return;

      // Send user message to AI
      const res = await fetch(`https://api.elevenlabs.io/v1/conversational-agent/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          session_id: callSessionId,
          message: response
        })
      });

      if (!res.ok) throw new Error('Failed to send message');

      const responseData = await res.json();
      setAiReply(responseData.reply); // Store AI reply

    } catch (error) {
      console.error('Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message to AI journalist.",
        variant: "destructive"
      });
    }
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
          <>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response to the journalist..."
              className="min-h-[100px]"
            />
            {aiReply && <p className="text-muted-foreground">📢 AI Reply: {aiReply}</p>}
          </>
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
            <Button className="w-full" onClick={handleSubmitResponse}>
              Send Response
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={handlePostpone} disabled={isRecording || countdown !== null}>
            Ask for 2 Minutes
          </Button>
          <Button variant="ghost" className="w-full" onClick={onDecline} disabled={isRecording || countdown !== null}>
            Decline Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
