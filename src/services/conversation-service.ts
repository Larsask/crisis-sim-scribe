
import { supabase } from '@/integrations/supabase/client';
import { crisisMemoryManager } from '@/utils/crisis-memory';

interface NPCPersonality {
  name: string;
  role: string;
  style: string;
  agenda: string;
}

const NPC_PERSONALITIES: Record<string, NPCPersonality> = {
  'Sarah Chen': {
    name: 'Sarah Chen',
    role: 'Global News journalist',
    style: 'persistent and investigative',
    agenda: 'uncovering the full story behind the AI ethics scandal'
  },
  'Regulator': {
    name: 'Alex Thompson',
    role: 'government regulator',
    style: 'formal and thorough',
    agenda: 'ensuring compliance and public safety'
  },
  'Internal Team': {
    name: 'Technical Team',
    role: 'internal stakeholder',
    style: 'technical and detailed',
    agenda: 'maintaining system integrity while addressing concerns'
  }
};

export const conversationService = {
  async generateResponse(
    npcId: string,
    userMessage: string,
    pastInteractions: Array<{ type: string; content: string }>,
    context: {
      crisisSeverity: 'low' | 'medium' | 'high';
      publicTrust: number;
      declined?: boolean;
    }
  ): Promise<string> {
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'OPENAI_API_KEY' });

    if (secretError || !secretData) {
      console.error('Failed to retrieve API key:', secretError);
      return this.getFallbackResponse(npcId, context.declined);
    }

    const npc = NPC_PERSONALITIES[npcId];
    if (!npc) return this.getFallbackResponse(npcId, context.declined);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretData}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are ${npc.name}, a ${npc.role}. You are ${npc.style} and focused on ${npc.agenda}. 
              Current crisis severity: ${context.crisisSeverity}
              Public trust level: ${context.publicTrust}%
              ${context.declined ? 'Previous call was declined.' : ''}
              
              Past interactions:
              ${pastInteractions.map(i => `- ${i.content}`).join('\n')}
              
              Respond in character, keeping the response under 150 words. If this is a follow-up to a declined call, be more assertive.`
            },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.8,
          max_tokens: 200
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getFallbackResponse(npcId, context.declined);
    }
  },

  getFallbackResponse(npcId: string, declined?: boolean): string {
    if (declined) {
      return "Your lack of response is concerning. We need an official statement for our upcoming coverage.";
    }
    return "We need clarification on recent developments. Please provide an official response.";
  }
};
