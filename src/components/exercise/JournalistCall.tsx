
import { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, Phone, PhoneOff, MessageSquare, 
  PhoneIncoming, UserX, Clock 
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
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [textResponse, setTextResponse] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState("This is Sarah Chen from Global News. We've received reports about the ongoing situation. Can you provide an official statement?");
  const [hasResponded, setHasResponded] = useState(false);
  const [callState, setCallState] = useState<'incoming' | 'active' | 'declined' | 'failed'>('incoming');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-decline call after 30 seconds if not answered
    const timeout = setTimeout(() => {
      if (callState === 'incoming') {
        handleDecline();
      }
    }, 30000);
    
    setTimeoutId(timeout);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [callState]);

  const handleAccept = async () => {
    setCallState('active');
    if (timeoutId) clearTimeout(timeoutId);
    
    if (!textMode) {
      try {
        await playJournalistVoice();
      } catch (error) {
        console.error('Failed to start voice call:', error);
        toast({
          title: "Voice Call Failed",
          description: "Switching to text mode for this conversation.",
          variant: "destructive"
        });
        setTextMode(true);
      }
    }
  };

  const handleDecline = () => {
    setCallState('declined');
    if (timeoutId) clearTimeout(timeoutId);
    
    toast({
      title: "Call Declined",
      description: "The journalist may publish without your input.",
      variant: "destructive"
    });
    
    if (onDecline) onDecline();
    
    // Auto-close after showing the message
    setTimeout(onClose, 3000);
  };

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
      await audio.play();
      
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

  const handleResponse = async (response: string) => {
    if (hasResponded) return;

    setHasResponded(true);
    onResponse(response);

    // Simulate Sarah Chen's reaction with follow-up questions
    const reactions = [
      "I understand your position, but our viewers deserve more details. Can you elaborate?",
      "That's interesting. How do you respond to critics who say otherwise?",
      "We'll be running this story in tonight's news. Would you like to add anything else?"
    ];
    
    const newQuestion = reactions[Math.floor(Math.random() * reactions.length)];
    setCurrentQuestion(newQuestion);
    
    if (!textMode) {
      await playJournalistVoice();
    }
    
    setHasResponded(false);
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

  const predefinedResponses = [
    "We take these reports seriously and are conducting a thorough review.",
    "We're implementing immediate measures to address the situation.",
    "We're working closely with all stakeholders to resolve this matter.",
  ];

  if (callState === 'incoming') {
    return (
      <Card className="fixed inset-0 m-auto w-[450px] h-[200px] p-6 flex flex-col justify-between bg-background/95 backdrop-blur shadow-lg">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <PhoneIncoming className="h-6 w-6 text-blue-500 animate-pulse" />
            <h3 className="font-semibold text-lg">Incoming Call: Sarah Chen - Global News</h3>
          </div>
          <p className="text-muted-foreground">Journalist requesting statement</p>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600"
            onClick={handleDecline}
          >
            <PhoneOff className="h-6 w-6 text-white" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600"
            onClick={handleAccept}
          >
            <Phone className="h-6 w-6 text-white" />
          </Button>
        </div>
      </Card>
    );
  }

  if (callState === 'declined') {
    return (
      <Card className="fixed inset-0 m-auto w-[450px] h-[200px] p-6 flex flex-col justify-between bg-background/95 backdrop-blur">
        <div className="text-center space-y-4">
          <UserX className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="font-semibold text-lg">Call Declined</h3>
          <p className="text-muted-foreground">The journalist may publish without your input</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed inset-0 m-auto w-[450px] h-auto max-h-[80vh] p-6 flex flex-col justify-between bg-background/95 backdrop-blur overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="font-semibold text-lg mb-2">Sarah Chen - Global News</h3>
        <div className="bg-muted p-4 rounded-lg mb-4 text-left">
          <p className="text-muted-foreground">{currentQuestion}</p>
        </div>
        
        {textMode && (
          <div className="space-y-4">
            <div className="space-y-2">
              {predefinedResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-3 px-4"
                  onClick={() => handleResponse(response)}
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
                onClick={() => textResponse.trim() && handleResponse(textResponse)}
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
            onClick={onClose}
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
