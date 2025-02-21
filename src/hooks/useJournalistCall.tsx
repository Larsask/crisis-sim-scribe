
import React from 'react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { crisisMemoryManager } from '@/utils/crisis-memory';
import { ToastAction } from '@/components/ui/toast';

type JournalistCallState = 'inactive' | 'incoming' | 'active' | 'declined' | 'failed' | 'text-mode';

export const useJournalistCall = () => {
  const [showJournalistCall, setShowJournalistCall] = useState(false);
  const [journalistCallState, setJournalistCallState] = useState<JournalistCallState>('inactive');
  const { toast } = useToast();

  const handleJournalistResponse = (response: string) => {
    crisisMemoryManager.addInteraction('Press', 'journalist-call', response);
    
    toast({
      title: "Response Sent",
      description: "The journalist will consider your statement for their story.",
      duration: null
    });

    if (journalistCallState === 'failed' || journalistCallState === 'text-mode') {
      crisisMemoryManager.addInteraction('Press', 'text-response', response);
    }

    setJournalistCallState('inactive');
    setShowJournalistCall(false);
  };

  const handleCallDecline = () => {
    setJournalistCallState('declined');
    
    toast({
      title: "Call Declined",
      description: "The journalist may publish without your input. Would you like to send a text statement instead?",
      duration: null,
      action: (
        <ToastAction altText="Send text statement" onClick={() => setJournalistCallState('text-mode')}>
          Send Text
        </ToastAction>
      )
    });
  };

  const handleCallFailure = () => {
    setJournalistCallState('failed');
    toast({
      title: "Call Failed",
      description: "Switching to text mode for this conversation.",
      duration: 5000
    });
  };

  return {
    showJournalistCall,
    setShowJournalistCall,
    journalistCallState,
    setJournalistCallState,
    handleJournalistResponse,
    handleCallDecline,
    handleCallFailure
  };
};
