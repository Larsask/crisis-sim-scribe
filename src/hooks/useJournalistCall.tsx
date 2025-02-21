
import React from 'react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { crisisMemoryManager } from '@/utils/crisis-memory';
import { conversationService } from '@/services/conversation-service';
import { ToastAction } from '@/components/ui/toast';

type JournalistCallState = 'inactive' | 'incoming' | 'active' | 'declined' | 'failed' | 'text-mode';

export const useJournalistCall = () => {
  const [showJournalistCall, setShowJournalistCall] = useState(false);
  const [journalistCallState, setJournalistCallState] = useState<JournalistCallState>('inactive');
  const { toast } = useToast();

  const handleJournalistResponse = async (response: string) => {
    crisisMemoryManager.addInteraction('Press', 'journalist-call', response);
    
    const crisisState = crisisMemoryManager.getCrisisState();
    const pastInteractions = crisisMemoryManager.getStakeholderHistory('Sarah Chen');
    
    const aiResponse = await conversationService.generateResponse(
      'Sarah Chen',
      response,
      pastInteractions,
      {
        crisisSeverity: crisisState.severity,
        publicTrust: crisisState.publicTrust,
        declined: journalistCallState === 'declined'
      }
    );

    toast({
      title: "Sarah Chen's Response",
      description: aiResponse,
      duration: null,
      action: (
        <ToastAction altText="Send follow-up" onClick={() => setJournalistCallState('text-mode')}>
          Send Follow-up
        </ToastAction>
      )
    });

    if (journalistCallState === 'failed' || journalistCallState === 'text-mode') {
      crisisMemoryManager.addInteraction('Press', 'text-response', response);
    }

    setJournalistCallState('inactive');
    setShowJournalistCall(false);
  };

  const handleCallDecline = async () => {
    setJournalistCallState('declined');
    
    const crisisState = crisisMemoryManager.getCrisisState();
    const pastInteractions = crisisMemoryManager.getStakeholderHistory('Sarah Chen');
    
    const aiResponse = await conversationService.generateResponse(
      'Sarah Chen',
      "Call declined by company representative",
      pastInteractions,
      {
        crisisSeverity: crisisState.severity,
        publicTrust: crisisState.publicTrust,
        declined: true
      }
    );
    
    toast({
      title: "Call Declined",
      description: aiResponse,
      duration: null,
      action: (
        <ToastAction altText="Send text statement" onClick={() => setJournalistCallState('text-mode')}>
          Send Text
        </ToastAction>
      )
    });
  };

  const handleCallFailure = async () => {
    setJournalistCallState('failed');
    const aiResponse = await conversationService.generateResponse(
      'Sarah Chen',
      "Technical difficulties during the call",
      [],
      { crisisSeverity: 'medium', publicTrust: 50 }
    );

    toast({
      title: "Call Failed",
      description: aiResponse,
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
