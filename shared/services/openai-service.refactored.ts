import OpenAI from "openai";
import { AIServiceInterface, ChatMessage } from "../types";

export class OpenAIService implements AIServiceInterface {
  private client: OpenAI;
  private model: string;
  
  constructor(model: string = 'gpt-4') {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
    });
    this.model = model;
  }
  
  /**
   * Generate a response from the OpenAI API
   */
  async generateResponse(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1000,
      });
      
      return response.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Sorry, I encountered an error while generating a response.';
    }
  }
  
  /**
   * Generate a title for a conversation based on the first message
   */
  async generateTitle(message: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Generate a short, concise title (max 6 words) for a conversation that starts with this message:'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 20,
      });
      
      return response.choices[0]?.message?.content || 'New Conversation';
    } catch (error) {
      console.error('OpenAI API error generating title:', error);
      return 'New Conversation';
    }
  }
}