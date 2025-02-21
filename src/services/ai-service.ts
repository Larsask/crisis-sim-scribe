
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

interface NewsArticleParams {
  headline: string;
  context: string;
  tone: 'neutral' | 'critical' | 'supportive';
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
        model: 'gpt-3.5-turbo',  // Using GPT-3.5 as requested
        messages: [
          {
            role: 'system',
            content: `You are an AI crisis management assistant analyzing real-time decisions in a crisis scenario. 
            Consider:
            - Current crisis severity: ${context.currentSeverity}
            - Stakeholder mood: ${context.stakeholderMood}
            - Communication style: ${context.style || 'neutral'}
            - Response tone: ${context.tone || 'formal'}
            - Past decisions: ${context.pastDecisions.join(', ')}
            
            Format the response as:
            1. Main analysis (2-3 sentences)
            2. List immediate consequences (start each with -)
            3. Key stakeholder reactions (start each with -)
            4. Suggested next actions (start each with -)`
          },
          {
            role: 'user',
            content: `Decision made: "${decision}"
            
            Analyze this decision's impact considering all past context and current situation.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    // Parse the AI response into structured format
    const sections = result.split('\n\n');
    const mainResponse = sections[0] || '';
    
    const consequences = sections[1]?.split('\n')
      .filter(line => line.startsWith('-'))
      .map(line => line.substring(2)) || 
      ["Impact being assessed"];

    const stakeholderReactions = sections[2]?.split('\n')
      .filter(line => line.startsWith('-'))
      .map(line => ({
        group: line.includes(':') ? line.split(':')[0].substring(2) : "Stakeholder",
        reaction: line.includes(':') ? line.split(':')[1].trim() : line.substring(2),
        urgency: context.currentSeverity as 'normal' | 'urgent' | 'critical'
      })) || [{
        group: "Media",
        reaction: "Analyzing the situation",
        urgency: context.currentSeverity as 'normal' | 'urgent' | 'critical'
      }];

    const suggestedActions = sections[3]?.split('\n')
      .filter(line => line.startsWith('-'))
      .map(line => ({
        text: line.substring(2),
        impact: context.currentSeverity as 'low' | 'medium' | 'high',
        consequence: "Could affect stakeholder trust and media coverage"
      })) || [{
        text: "Monitor situation",
        impact: "medium",
        consequence: "Allows time for proper assessment"
      }];

    return {
      mainResponse,
      consequences,
      stakeholderReactions: stakeholderReactions.slice(0, 3), // Limit to 3 reactions
      suggestedActions
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

const generateNewsArticle = async ({ headline, context, tone }: NewsArticleParams): Promise<string> => {
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
        model: 'gpt-3.5-turbo',  // Using GPT-3.5 as requested
        messages: [
          {
            role: 'system',
            content: `You are an experienced journalist writing about an ongoing crisis.
            Write a concise, factual article with:
            - A clear lead paragraph
            - Relevant background context
            - At least one quote from a stakeholder
            - Impact assessment
            Maintain a ${tone} tone throughout.`
          },
          {
            role: 'user',
            content: `Write a news article with the headline: "${headline}"
            Context: ${context}
            Include realistic quotes and maintain journalistic standards.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating news article:', error);
    return `Breaking News: ${headline}\n\nDeveloping story. More details to follow.`;
  }
};

export const aiService = {
  generateResponse: generateAIResponse,
  generateNewsArticle
};
