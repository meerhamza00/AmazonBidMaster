import OpenAI from "openai";
import { AiService } from "./ai-service";
import { AiProvider, ChatMessage, ChatSettings } from "../chatbot";

export class OpenAiService implements AiService {
  provider: AiProvider = 'openai';
  private client: OpenAI | null = null;

  constructor() {
    // Initialize OpenAI client if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  async sendMessages(messages: ChatMessage[], settings?: Partial<ChatSettings>): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client is not configured. Please provide an API key.');
    }

    try {
      // Convert our message format to OpenAI's format
      const openaiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.client.chat.completions.create({
        model: settings?.model || "gpt-4o",
        messages: openaiMessages,
        temperature: settings?.temperature || 0.7,
        max_tokens: settings?.maxTokens || 1024,
      });

      // Extract and return the assistant's message content
      return response.choices[0].message.content || '';
    } catch (error: any) {
      console.error('Error calling OpenAI API:', error);
      throw new Error(`Failed to get response from OpenAI: ${error?.message || 'Unknown error'}`);
    }
  }

  async generateTitle(userMessage: string): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client is not configured. Please provide an API key.');
    }

    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Generate a short, descriptive title (maximum 6 words) for this conversation based on the user's message. The title should be concise but accurately reflect the main topic."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.5,
        max_tokens: 25,
      });

      const title = response.choices[0].message.content?.trim();
      return title || 'New conversation';
    } catch (error: any) {
      console.error('Error generating title with OpenAI:', error);
      return 'New conversation';
    }
  }
}