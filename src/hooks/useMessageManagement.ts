
import { useState } from 'react';
import { StakeholderMessage } from '@/types/crisis';
import { crisisMemoryManager } from '@/utils/crisis-memory';

export const useMessageManagement = () => {
  const [messages, setMessages] = useState<StakeholderMessage[]>([]);

  const addMessage = (message: StakeholderMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const removeMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const handleStakeholderResponse = (messageId: string, response: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    crisisMemoryManager.addInteraction(message.sender, messageId, response);
    removeMessage(messageId);

    const npcStatus = crisisMemoryManager.getNPCStatus(message.sender);
    if (npcStatus && npcStatus.relationshipStatus === 'negative') {
      const followUp: StakeholderMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: message.sender,
        content: crisisMemoryManager.generateResponse(
          message.sender,
          "Your recent responses have been concerning. We need immediate clarification."
        ),
        timestamp: Date.now() + 5000,
        urgency: 'critical',
        type: 'email',
        status: 'unread',
        responseDeadline: Date.now() + 300000 // 5 minutes
      };
      setTimeout(() => addMessage(followUp), 5000);
    }
  };

  return {
    messages,
    addMessage,
    removeMessage,
    handleStakeholderResponse
  };
};
