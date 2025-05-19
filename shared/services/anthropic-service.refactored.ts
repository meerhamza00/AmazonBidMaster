import Anthropic from "@anthropic-ai/sdk";
import { AIServiceInterface, ChatMessage } from "../types";

export class AnthropicService implements AIServiceInterface {
  private client: Anthropic;
  private model: string;
  
  constructor(model: string = 'claude-3-opus') {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key',
    });
    this.model = model;
  }
  
  /**
   * Generate a response from the Anthropic API
   */
  async generateResponse(messages: ChatMessage[]): Promise<string> {
    try {
      // Convert messages to Anthropic format
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));
      
      const response = await this.client.messages.create({
        model: this.model,
        messages: formattedMessages as any,
        max_tokens: 1000,
      });
      
      return response.content[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Anthropic API error:', error);
      return 'Sorry, I encountered an error while generating a response.';
    }
  }
  
  /**
   * Generate a title for a conversation based on the first message
   */
  async generateTitle(message: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: `Generate a short, concise title (max 6 words) for a conversation that starts with this message: "${message}"`
          }
        ],
        max_tokens: 20,
      });
      
      return response.content[0]?.text || 'New Conversation';
    } catch (error) {
      console.error('Anthropic API error generating title:', error);
      return 'New Conversation';
    }
  }
}