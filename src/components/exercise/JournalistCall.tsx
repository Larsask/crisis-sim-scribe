
import { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Phone, PhoneOff, MessageSquare } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface JournalistCallProps {
  onClose: () => void;
  onResponse: (response: string) => void;
}

export const JournalistCall = ({ onClose, onResponse }: JournalistCallProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [textResponse, setTextResponse] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState("This is Sarah Chen from Global News. We've received reports about the ongoing situation. Can you provide an official statement?");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!textMode) {
      playJournalistVoice();
    }
  }, [textMode]);

  const playJournalistVoice = async () => {
    setIsLoading(true);
    try {
      const { data: secretData, error: secretError } = await supabase
        .rpc('get_secret', { secret_name: 'ELEVENLABS_API_KEY' });

      if (secretError || !secretData) {
        console.error('Failed to retrieve API key:', secretError);
        setTextMode(true);
        return;
      }

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': secretData
        },
        body: JSON.stringify({
          text: currentQuestion,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.play();
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Voice Call Failed",
        description: "Switching to text mode for this conversation.",
        variant: "destructive"
      });
      setTextMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        // Here you could send the audio to a speech-to-text service
        console.log('Recording stopped, audio URL:', audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Failed",
        description: "Unable to access microphone. Switching to text mode.",
        variant: "destructive"
      });
      setTextMode(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    onClose();
  };

  const predefinedResponses = [
    "We take these reports seriously and are conducting a thorough review.",
    "We're implementing immediate measures to address the situation.",
    "We're working closely with all stakeholders to resolve this matter.",
  ];

  return (
    <Card className="fixed inset-0 m-auto w-[450px] h-auto max-h-[80vh] p-6 flex flex-col justify-between bg-background/95 backdrop-blur overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="font-semibold text-lg mb-2">Sarah Chen - Global News</h3>
        <p className="text-muted-foreground mb-4">{currentQuestion}</p>
        
        {textMode && (
          <div className="space-y-4">
            <div className="space-y-2">
              {predefinedResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-3 px-4"
                  onClick={() => onResponse(response)}
                >
                  {response}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Textarea
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                placeholder="Type your custom response..."
                className="min-h-[100px]"
              />
              <Button 
                className="w-full"
                onClick={() => textResponse.trim() && onResponse(textResponse)}
                disabled={!textResponse.trim()}
              >
                Send Custom Response
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {isLoading && <p className="text-center">Connecting...</p>}
        
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600"
            onClick={handleClose}
          >
            <PhoneOff className="h-6 w-6 text-white" />
          </Button>
          
          {!textMode && (
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600"
              onClick={() => {
                if (isRecording) {
                  stopRecording();
                } else {
                  startRecording();
                }
              }}
            >
              {isRecording ? (
                <Phone className="h-6 w-6 text-white" />
              ) : (
                <Mic className="h-6 w-6 text-white" />
              )}
            </Button>
          )}
          
          {!textMode && (
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600"
              onClick={() => setTextMode(true)}
            >
              <MessageSquare className="h-6 w-6 text-white" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
