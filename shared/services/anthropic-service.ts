import Anthropic from '@anthropic-ai/sdk';
import { AiService } from './ai-service';
import { AiProvider, ChatMessage, ChatSettings } from '../chatbot';

export class AnthropicService implements AiService {
  provider: AiProvider = 'anthropic';
  private client: Anthropic | null = null;

  constructor() {
    // Initialize Anthropic client if API key is available
    if (process.env.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  async sendMessages(messages: ChatMessage[], settings?: Partial<ChatSettings>): Promise<string> {
    if (!this.client) {
      throw new Error('Anthropic client is not configured. Please provide an API key.');
    }

    try {
      // Separate system messages from user/assistant messages
      const systemMessages = messages.filter(msg => msg.role === 'system');
      const conversationMessages = messages.filter(msg => msg.role !== 'system');

      // Combine system messages into a single system prompt
      const systemPrompt = systemMessages.map(msg => msg.content).join('\n\n');

      // Convert our message format to Anthropic's format
      // Anthropic API only accepts 'user' and 'assistant' roles
      const anthropicMessages = conversationMessages.map(msg => ({
        role: msg.role === 'system' ? 'user' : msg.role, // Convert 'system' to 'user' if needed
        content: msg.content,
      }));

      // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      const response = await this.client.messages.create({
        model: settings?.model || "claude-3-7-sonnet-20250219",
        system: systemPrompt,
        messages: anthropicMessages,
        max_tokens: settings?.maxTokens || 1024,
        temperature: settings?.temperature || 0.7,
      });

      // Safe access to response content
      const responseText = response.content[0] && 'text' in response.content[0] 
        ? response.content[0].text 
        : '';
      return responseText;
    } catch (error: any) {
      console.error('Error calling Anthropic API:', error);
      throw new Error(`Failed to get response from Anthropic: ${error?.message || 'Unknown error'}`);
    }
  }

  async generateTitle(userMessage: string): Promise<string> {
    if (!this.client) {
      throw new Error('Anthropic client is not configured. Please provide an API key.');
    }

    try {
      // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      const response = await this.client.messages.create({
        model: "claude-3-7-sonnet-20250219",
        system: "Generate a short, descriptive title (maximum 6 words) for this conversation based on the user's message. The title should be concise but accurately reflect the main topic.",
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 25,
        temperature: 0.5,
      });

      // Safe access to content with type checking
      const title = response.content[0] && 'text' in response.content[0] 
        ? response.content[0].text 
        : 'New conversation';
      return title.trim();
    } catch (error: any) {
      console.error('Error generating title with Anthropic:', error);
      return 'New conversation';
    }
  }
}