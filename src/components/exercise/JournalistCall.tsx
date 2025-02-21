
import { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, PhoneOff, MessageSquare, 
  PhoneIncoming, Clock 
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface JournalistCallProps {
  onClose: () => void;
  onResponse: (response: string) => void;
  onDecline?: () => void;
}

export const JournalistCall = ({ onClose, onResponse, onDecline }: JournalistCallProps) => {
  const { toast } = useToast();
  const [callState, setCallState] = useState<'incoming' | 'active' | 'declined' | 'text-mode'>('incoming');
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [textResponse, setTextResponse] = useState('');
  const [hasResponded, setHasResponded] = useState(false);
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

  const handleAccept = () => {
    setCallState('active');
    if (timeoutId) clearTimeout(timeoutId);
    setCurrentQuestion("This is Sarah Chen from Global News. We're following up on recent developments. Can you provide an official statement?");
  };

  const handleDecline = () => {
    setCallState('declined');
    if (timeoutId) clearTimeout(timeoutId);
    onDecline?.();
    
    toast({
      title: "Call Declined",
      description: "The journalist may publish without your input. Consider sending a written statement.",
      duration: 5000,
    });

    // Show text mode after 3 seconds
    setTimeout(() => {
      setCallState('text-mode');
    }, 3000);
  };

  const handleResponse = (response: string) => {
    if (hasResponded) return;

    setHasResponded(true);
    onResponse(response);

    // Generate follow-up based on response
    const followUps = [
      "Your response raises some questions. Our sources suggest a different narrative. Would you care to address these discrepancies?",
      "We've received contradicting information from stakeholders. How do you respond to their concerns?",
      "This will be a leading story in tonight's coverage. Would you like to add any final comments?"
    ];
    
    const newQuestion = followUps[Math.floor(Math.random() * followUps.length)];
    setCurrentQuestion(newQuestion);
    setHasResponded(false);
  };

  if (callState === 'incoming') {
    return (
      <Card className="w-full max-w-lg bg-white p-6 shadow-xl">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <PhoneIncoming className="h-6 w-6 text-blue-500 animate-pulse" />
            <h3 className="font-semibold text-lg">Incoming Call: Sarah Chen - Global News</h3>
          </div>
          <p className="text-muted-foreground">Journalist requesting statement</p>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="destructive"
              onClick={handleDecline}
              className="w-32"
            >
              <PhoneOff className="mr-2 h-4 w-4" />
              Decline
            </Button>
            <Button
              variant="default"
              onClick={handleAccept}
              className="w-32"
            >
              <Phone className="mr-2 h-4 w-4" />
              Accept
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (callState === 'declined') {
    return (
      <Card className="w-full max-w-lg bg-white p-6 shadow-xl">
        <div className="text-center space-y-4">
          <PhoneOff className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="font-semibold text-lg">Call Declined</h3>
          <p className="text-muted-foreground">Switching to text mode...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg bg-white p-6 shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Sarah Chen - Global News</h3>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>

        {currentQuestion && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">{currentQuestion}</p>
          </div>
        )}

        <div className="space-y-2">
          <Textarea
            value={textResponse}
            onChange={(e) => setTextResponse(e.target.value)}
            placeholder="Type your response..."
            className="min-h-[100px]"
          />
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              End Call
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (textResponse.trim()) {
                  handleResponse(textResponse);
                  setTextResponse('');
                }
              }}
              disabled={!textResponse.trim()}
              className="w-full"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Response
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
