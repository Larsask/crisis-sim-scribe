
import { supabase } from '@/integrations/supabase/client';

export const openaiTest = {
  async testApiKey(): Promise<{ success: boolean; message: string }> {
    try {
      // First, attempt to retrieve the API key from Supabase
      const { data: secretData, error: secretError } = await supabase
        .rpc('get_secret', { secret_name: 'OPENAI_API_KEY' });

      if (secretError || !secretData || !secretData[0]) {
        console.error('Failed to retrieve API key:', secretError);
        return {
          success: false,
          message: `Failed to retrieve API key: ${secretError?.message || 'Unknown error'}`
        };
      }

      const apiKey = secretData[0].value;

      // Test the API key with a simple completion request
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
              content: 'You are a test assistant. Respond with "API key is working correctly!"'
            },
            {
              role: 'user',
              content: 'Test connection'
            }
          ],
          temperature: 0.7,
          max_tokens: 50
        })
      });

      const data = await response.json();
      
      if (data.error) {
        return {
          success: false,
          message: `OpenAI API error: ${data.error.message}`
        };
      }

      if (data.choices && data.choices[0]) {
        return {
          success: true,
          message: 'Successfully connected to OpenAI API'
        };
      }

      return {
        success: false,
        message: 'Unexpected response format from OpenAI API'
      };

    } catch (error) {
      console.error('Error testing OpenAI connection:', error);
      return {
        success: false,
        message: `Error testing connection: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

