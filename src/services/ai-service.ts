
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

interface NewOptionsContext {
  decision: string;
  crisisState: any;
  pastEvents: any[];
}

const DEFAULT_OPTIONS: DecisionOption[] = [
  {
    id: '1',
    text: 'Monitor the situation',
    impact: 'low',
    consequence: 'Allows time for proper assessment'
  },
  {
    id: '2',
    text: 'Engage with stakeholders',
    impact: 'medium',
    consequence: 'Maintains communication channels'
  }
];

export const aiService = {
  async generateNewOptions(context: NewOptionsContext): Promise<DecisionOption[]> {
    try {
      const { data: secretData, error: secretError } = await supabase
        .rpc('get_secret', { secret_name: 'OPENAI_API_KEY' });

      if (secretError || !secretData || !secretData[0]) {
        console.error('Failed to retrieve API key:', secretError);
        return DEFAULT_OPTIONS;
      }

      const apiKey = secretData[0].value;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Generate 3-4 realistic next actions for a crisis situation.
              Consider:
              - Previous decision: ${context.decision}
              - Crisis severity: ${context.crisisState.severity}
              - Recent events: ${JSON.stringify(context.pastEvents.slice(-2))}
              
              Each option should include:
              1. Clear action text
              2. Potential impact (low/medium/high)
              3. Likely consequence`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      const result = data.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No content in OpenAI response');
      }

      // Parse the response into DecisionOption format
      const options = result.split('\n')
        .filter(line => line.trim())
        .map(line => ({
          id: Math.random().toString(36).substr(2, 9),
          text: line.includes(':') ? line.split(':')[1].trim() : line,
          impact: (context.crisisState.severity || 'medium') as 'low' | 'medium' | 'high',
          consequence: 'This action will affect the crisis trajectory'
        }));

      return options.slice(0, 4); // Return max 4 options
    } catch (error) {
      console.error('Error generating new options:', error);
      return DEFAULT_OPTIONS;
    }
  },

  async generateResponse(
    decision: string,
    context: AIRequestContext
  ): Promise<AIResponse> {
    try {
      const { data: secretData, error: secretError } = await supabase
        .rpc('get_secret', { secret_name: 'OPENAI_API_KEY' });

      if (secretError || !secretData || !secretData[0]) {
        throw new Error('Failed to retrieve API key');
      }

      const apiKey = secretData[0].value;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an AI crisis management simulator analyzing real-time decisions. Consider:
              - Crisis severity: ${context.currentSeverity}
              - Stakeholder mood: ${context.stakeholderMood}
              - Past decisions: ${context.pastDecisions.join(', ')}
              
              Generate realistic responses with:
              1. Immediate consequences that affect multiple stakeholders
              2. Evolving media narratives based on past decisions
              3. Internal organizational impacts
              4. Stakeholder relationship changes
              5. New emerging challenges or opportunities`
            },
            {
              role: 'user',
              content: `Decision made: "${decision}"
              
              Generate a detailed crisis response including:
              1. Main impact analysis
              2. Stakeholder reactions
              3. Media response
              4. Internal effects
              5. New challenges`
            }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      const result = data.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No content in OpenAI response');
      }

      // Parse response into structured format
      const sections = result.split('\n\n');
      const mainResponse = sections[0] || 'Response being analyzed...';
      
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

  async generateNewsArticle({ headline, context, tone }: NewsArticleParams): Promise<string> {
    try {
      const { data: secretData, error: secretError } = await supabase
        .rpc('get_secret', { secret_name: 'OPENAI_API_KEY' });

      if (secretError || !secretData || !secretData[0]) {
        throw new Error('Failed to retrieve API key');
      }

      const apiKey = secretData[0].value;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an experienced journalist covering a developing crisis.
              Generate realistic news coverage with:
              1. Breaking news lead paragraph
              2. Critical analysis of the situation
              3. Stakeholder quotes (both supportive and critical)
              4. Industry expert perspectives
              5. Potential implications
              Maintain a ${tone} tone while creating urgency.`
            },
            {
              role: 'user',
              content: `Write a news article:
              Headline: "${headline}"
              Context: ${context}
              Include balanced perspectives and maintain journalistic standards.`
            }
          ],
          temperature: 0.8,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      const result = data.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No content in OpenAI response');
      }

      return result;
    } catch (error) {
      console.error('Error generating news article:', error);
      return `Breaking News: ${headline}\n\nDeveloping story. More details to follow.`;
    }
  },

  async generateStakeholderUpdate(crisisState: any, pastEvents: any[]): Promise<string> {
    try {
      const { data: secretData, error: secretError } = await supabase
        .rpc('get_secret', { secret_name: 'OPENAI_API_KEY' });

      if (secretError || !secretData || !secretData[0]) {
        throw new Error('Failed to retrieve API key');
      }

      const apiKey = secretData[0].value;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Generate realistic stakeholder updates based on:
              - Crisis severity: ${crisisState.severity}
              - Public trust: ${crisisState.publicTrust}%
              - Recent events: ${JSON.stringify(pastEvents.slice(-3))}
              
              Create updates that reflect:
              1. Stakeholder concerns
              2. Relationship changes
              3. New demands or expectations
              4. Potential actions`
            }
          ],
          temperature: 0.8,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      const result = data.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No content in OpenAI response');
      }

      return result;
    } catch (error) {
      console.error('Error generating stakeholder update:', error);
      return `Key stakeholders are monitoring the situation closely and requesting updates.`;
    }
  }
};
