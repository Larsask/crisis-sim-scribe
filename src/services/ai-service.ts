
import { supabase } from '@/integrations/supabase/client';
import { AIResponse } from '@/types/crisis-enhanced';
import { DecisionOption } from '@/types/crisis';

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

export const aiService = {
  generateResponse: async (decision: string, context: AIRequestContext): Promise<AIResponse> => {
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
              content: `You are an AI crisis management assistant analyzing real-time decisions in a crisis scenario. 
              Consider:
              - Current crisis severity: ${context.currentSeverity}
              - Stakeholder mood: ${context.stakeholderMood}
              - Communication style: ${context.style || 'neutral'}
              - Response tone: ${context.tone || 'formal'}
              - Past decisions: ${context.pastDecisions.join(', ')}
              
              Generate realistic and challenging crisis scenarios with:
              1. Immediate consequences
              2. Stakeholder reactions
              3. Media responses
              4. Internal impacts
              5. Suggested actions that lead to meaningful choices`
            },
            {
              role: 'user',
              content: `Decision made: "${decision}"
              
              Generate a detailed crisis response including multiple events, stakeholder reactions, and new challenges.`
            }
          ],
          temperature: 0.8,
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
        })) || [];

      const suggestedActions = sections[3]?.split('\n')
        .filter(line => line.startsWith('-'))
        .map(line => ({
          text: line.substring(2),
          impact: context.currentSeverity as 'low' | 'medium' | 'high',
          consequence: "Could affect stakeholder trust and media coverage"
        })) || [];

      return {
        mainResponse,
        consequences,
        stakeholderReactions: stakeholderReactions.slice(0, 3),
        suggestedActions
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        mainResponse: "Your decision has been acknowledged. Analyzing implications...",
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
  },

  generateNewsArticle: async ({ headline, context, tone }: NewsArticleParams): Promise<string> => {
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
              content: `You are an experienced journalist writing about an ongoing crisis.
              Generate realistic and impactful news coverage with:
              - Breaking news style lead paragraph
              - Critical analysis of the situation
              - Stakeholder quotes (both supportive and critical)
              - Industry expert perspectives
              - Potential implications and next developments
              Maintain a ${tone} tone while creating pressure and urgency.`
            },
            {
              role: 'user',
              content: `Write a news article with the headline: "${headline}"
              Context: ${context}
              Include multiple perspectives and maintain journalistic standards.`
            }
          ],
          temperature: 0.8,
          max_tokens: 800
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating news article:', error);
      return `Breaking News: ${headline}\n\nDeveloping story. More details to follow.`;
    }
  },

  generateNewOptions: async ({ decision, crisisState, pastEvents }: { 
    decision: string;
    crisisState: any;
    pastEvents: any[];
  }): Promise<DecisionOption[]> => {
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
              content: `Generate new strategic options for a crisis situation.
              Consider:
              - Recent decision: ${decision}
              - Crisis severity: ${crisisState.severity}
              - Public trust: ${crisisState.publicTrust}%
              - Media attention: ${crisisState.mediaAttention}%
              
              Create 3-4 distinct options that:
              - Respond to the current situation
              - Have meaningful consequences
              - Create interesting dilemmas
              - Lead to further developments`
            }
          ],
          temperature: 0.8,
          max_tokens: 500
        })
      });

      const data = await response.json();
      const suggestions = data.choices[0].message.content
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [text, consequence] = line.split('|').map(s => s.trim());
          return {
            id: Math.random().toString(36).substr(2, 9),
            text: text || "Monitor the situation",
            impact: crisisState.severity,
            consequence: consequence || "Impact being assessed"
          };
        });

      return suggestions;
    } catch (error) {
      console.error('Error generating options:', error);
      return [
        {
          id: Math.random().toString(36).substr(2, 9),
          text: "Issue a formal statement addressing concerns",
          impact: "medium",
          consequence: "May help stabilize public perception"
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          text: "Call an emergency stakeholder meeting",
          impact: "high",
          consequence: "Direct engagement could boost confidence"
        }
      ];
    }
  },

  generateMediaReaction: async (decision: string, crisisState: any): Promise<string> => {
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
              content: `Generate realistic media reactions to crisis management decisions.
              Consider the current state:
              - Crisis severity: ${crisisState.severity}
              - Public trust: ${crisisState.publicTrust}%
              - Media attention: ${crisisState.mediaAttention}%`
            },
            {
              role: 'user',
              content: `Generate media reaction to the decision: "${decision}"`
            }
          ],
          temperature: 0.8,
          max_tokens: 200
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating media reaction:', error);
      return `Media outlets are analyzing the decision to ${decision.toLowerCase()}. Expert opinions vary.`;
    }
  },

  generateStakeholderUpdate: async (crisisState: any, pastEvents: any[]): Promise<string> => {
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
              content: `Generate realistic stakeholder updates based on crisis progression.
              Consider:
              - Crisis severity: ${crisisState.severity}
              - Public trust: ${crisisState.publicTrust}%
              - Recent events: ${JSON.stringify(pastEvents.slice(-3))}`
            }
          ],
          temperature: 0.8,
          max_tokens: 200
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating stakeholder update:', error);
      return `Key stakeholders are monitoring the situation closely and requesting regular updates.`;
    }
  }
};
