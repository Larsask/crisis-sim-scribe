
import { supabase } from '@/integrations/supabase/client';
import { AIResponse } from '@/types/crisis-enhanced';

interface AIRequestContext {
  pastDecisions: string[];
  currentSeverity: 'low' | 'medium' | 'high';
  stakeholderMood: 'positive' | 'neutral' | 'negative';
  style?: 'concise' | 'detailed' | 'analytical';
  tone?: 'formal' | 'neutral' | 'urgent';
  includeSuggestions?: boolean;
}

const generateAIResponse = async (
  decision: string,
  context: AIRequestContext
): Promise<AIResponse> => {
  try {
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'OPENAI_API_KEY' });

    if (secretError || !secretData) {
      throw new Error('Failed to retrieve API key');
    }

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
            content: `You are an AI crisis management assistant. Analyze decisions and generate realistic, context-aware responses. Consider past decisions, stakeholder expectations, and potential consequences. Current crisis severity: ${context.currentSeverity}. Stakeholder mood: ${context.stakeholderMood}. Style: ${context.style || 'neutral'}. Tone: ${context.tone || 'formal'}.`
          },
          {
            role: 'user',
            content: `The user has made this decision: "${decision}". Their past decisions were: ${context.pastDecisions.join(', ')}. Generate a detailed response with consequences and stakeholder reactions.`
          }
        ]
      })
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    return {
      mainResponse: result,
      consequences: ["Immediate impact on public trust", "Media coverage intensifies"],
      stakeholderReactions: [
        {
          group: "Media",
          reaction: "Increased scrutiny of company policies",
          urgency: "urgent"
        }
      ],
      suggestedActions: [
        {
          text: "Issue a detailed public statement",
          impact: "high",
          consequence: "Could help restore public trust but might attract more scrutiny"
        }
      ]
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      mainResponse: "Your decision has been acknowledged. Stakeholders are reviewing the situation.",
      consequences: ["Impact being assessed"],
      stakeholderReactions: [
        {
          group: "Internal Team",
          reaction: "Analyzing implications",
          urgency: "normal"
        }
      ],
      suggestedActions: [
        {
          text: "Monitor situation",
          impact: "medium",
          consequence: "Allows time for proper assessment"
        }
      ]
    };
  }
};

export const aiService = {
  generateResponse: generateAIResponse
};
