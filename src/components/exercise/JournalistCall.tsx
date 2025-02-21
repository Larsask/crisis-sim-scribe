import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, PhoneOff, MessageSquare, 
  PhoneIncoming, Clock 
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface JournalistCallProps {
  onClose: () => void;
  onResponse: (response: string) => void;
  onDecline?: () => void;
}

export const JournalistCall = ({ onClose, onResponse, onDecline }: JournalistCallProps) => {
  const { toast } = useToast();
  const [callState, setCallState] = useState<'incoming' | 'active' | 'declined' | 'text-mode'>('incoming');
  const [aiReply, setAiReply] = useState<string>('');
  const [textResponse, setTextResponse] = useState('');
  const [callSessionId, setCallSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [journalistName, setJournalistName] = useState(''); // Dynamic AI Journalist

  // Fetch ElevenLabs API Key from Supabase
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

  // Handle AI Call with ElevenLabs
  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const apiKey = await fetchApiKey();
      if (!apiKey) return;

      // Start AI Call with ElevenLabs Conversational AI
      const response = await fetch('https://api.elevenlabs.io/v1/conversational-agent/start-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          agent_id: "kvR20HsbaSdUrbclBOzA", // Your ElevenLabs AI Agent
          prompt: "You're a journalist calling for an urgent interview about a developing AI ethics crisis. Introduce yourself with a name and ask the user for an official statement.",
          settings: {
            voice: "Alloy",
            temperature: 0.7
          }
        })
      });

      if (!response.ok) throw new Error('Failed to start AI call');

      const data = await response.json();
      setCallSessionId(data.session_id);
      setCallState('active');
      setJournalistName(data.agent_name || "AI Journalist"); // AI Generates Name

    } catch (error) {
      console.error('Error starting AI call:', error);
      toast({
        title: "Error",
        description: "Failed to start AI journalist call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle User Response to AI
  const handleResponse = async () => {
    if (!textResponse.trim()) {
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

      // Send response to AI journalist
      const res = await fetch('https://api.elevenlabs.io/v1/conversational-agent/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          session_id: callSessionId,
          message: textResponse
        })
      });

      if (!res.ok) throw new Error('Failed to send message');

      const responseData = await res.json();
      setAiReply(responseData.reply);

    } catch (error) {
      console.error('Error sending message to AI:", error);
      toast({
        title: "Error",
        description: "Failed to send message to AI journalist.",
        variant: "destructive"
      });
    }
  };

  // Handle Decline and Switch to Text Mode
  const handleDecline = () => {
    setCallState('declined');
    onDecline?.();

    toast({
      title: "Call Declined",
      description: "The journalist may publish without your input. Consider sending a written statement.",
      duration: 5000,
    });

    // Switch to text mode after 3 seconds
    setTimeout(() => {
      setCallState('text-mode');
    }, 3000);
  };

  return (
    <Card className="w-full max-w-lg bg-white p-6 shadow-xl">
      {callState === 'incoming' && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <PhoneIncoming className="h-6 w-6 text-blue-500 animate-pulse" />
            <h3 className="font-semibold text-lg">Incoming Call: {journalistName || "AI Journalist"}</h3>
          </div>
          <p className="text-muted-foreground">Journalist requesting statement</p>
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="destructive" onClick={handleDecline} className="w-32">
              <PhoneOff className="mr-2 h-4 w-4" /> Decline
            </Button>
            <Button variant="default" onClick={handleAccept} className="w-32">
              <Phone className="mr-2 h-4 w-4" /> Accept
            </Button>
          </div>
        </div>
      )}

      {callState === 'active' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{journalistName || "AI Journalist"}</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>

          {aiReply && <div className="bg-muted p-4 rounded-lg"><p className="text-sm">📢 {aiReply}</p></div>}

          <Textarea value={textResponse} onChange={(e) => setTextResponse(e.target.value)} placeholder="Type your response..." className="min-h-[100px]" />

          <Button variant="default" onClick={handleResponse} className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" /> Send Response
          </Button>
        </div>
      )}
    </Card>
  );
};
