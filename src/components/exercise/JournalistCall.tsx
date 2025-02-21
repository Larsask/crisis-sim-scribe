
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Phone, PhoneOff } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface JournalistCallProps {
  onClose: () => void;
  onResponse: (response: string, isCustom: boolean) => void;
}

export const JournalistCall = ({ onClose, onResponse }: JournalistCallProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    playJournalistVoice();
  }, []);

  const playJournalistVoice = async () => {
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
          text: "This is Sarah Chen from Global News. We've received reports about the ongoing situation. Can you provide an official statement?",
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

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to establish voice call. Switching to text mode.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="fixed inset-0 m-auto w-96 h-64 p-6 flex flex-col justify-between bg-background/95 backdrop-blur">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Incoming Call</h3>
        <p className="text-muted-foreground">Sarah Chen - Global News</p>
      </div>

      <div className="space-y-4">
        {isLoading && <p className="text-center">Connecting...</p>}
        
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600"
            onClick={onClose}
          >
            <PhoneOff className="h-6 w-6 text-white" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600"
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? (
              <Phone className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
