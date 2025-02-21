
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { crisisMemoryManager } from '@/utils/crisis-memory';

export const useJournalistCall = () => {
  const [showJournalistCall, setShowJournalistCall] = useState(false);
  const { toast } = useToast();

  const handleJournalistResponse = (response: string) => {
    crisisMemoryManager.addInteraction('Press', 'journalist-call', response);
    setShowJournalistCall(false);

    toast({
      title: "Response Sent",
      description: "The journalist will consider your statement for their story.",
    });
  };

  return {
    showJournalistCall,
    setShowJournalistCall,
    handleJournalistResponse
  };
};
