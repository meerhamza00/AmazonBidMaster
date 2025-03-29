import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiService } from './ai-service';
import { AiProvider, ChatMessage, ChatSettings } from '../chatbot';

export class GeminiService implements AiService {
  provider: AiProvider = 'gemini';
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    // Initialize Google Generative AI client if API key is available
    if (process.env.GOOGLE_API_KEY) {
      this.client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    }
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  async sendMessages(messages: ChatMessage[], settings?: Partial<ChatSettings>): Promise<string> {
    if (!this.client) {
      throw new Error('Google Gemini client is not configured. Please provide an API key.');
    }

    // Extract system message(s) if present
    const systemMessages = messages.filter(msg => msg.role === 'system');
    const conversationMessages = messages.filter(msg => msg.role !== 'system');
    
    // Create initial prompt that includes system message
    let initialPrompt = '';
    if (systemMessages.length > 0) {
      initialPrompt = `System Instructions: ${systemMessages.map(msg => msg.content).join('\n\n')}\n\n`;
    }

    // Initialize the chat with the latest model name
    // Note: Model names may have changed, using gemini-1.5-pro as default, with fallback to gemini-1.0-pro
    let modelName = 'gemini-1.5-pro';
    let model;
    let chat;
    
    try {
      // First try with the latest model name
      try {
        model = this.client.getGenerativeModel({ model: modelName });
        chat = model.startChat({
          generationConfig: {
            temperature: settings?.temperature || 0.7,
            maxOutputTokens: settings?.maxTokens || 1024,
          },
        });
      } catch (modelError) {
        // If the first model fails, try the fallback model
        console.log(`Model ${modelName} not found, trying fallback model...`);
        modelName = 'gemini-1.0-pro';
        model = this.client.getGenerativeModel({ model: modelName });
        chat = model.startChat({
          generationConfig: {
            temperature: settings?.temperature || 0.7,
            maxOutputTokens: settings?.maxTokens || 1024,
          },
        });
      }
      
      // Add system message as first user message if it exists
      if (initialPrompt) {
        await chat.sendMessage(initialPrompt);
      }
      
      // Send all messages to the chat in order
      let lastResponse = '';
      for (const msg of conversationMessages) {
        // Skip assistant messages as they are already part of the history
        if (msg.role === 'assistant') continue;
        
        const result = await chat.sendMessage(msg.content);
        lastResponse = result.response.text();
      }
      
      return lastResponse;
    } catch (error: any) {
      console.error('Error calling Google Generative AI:', error);
      throw new Error(`Failed to get response from Google Gemini: ${error?.message || 'Unknown error'}`);
    }
  }

  async generateTitle(userMessage: string): Promise<string> {
    if (!this.client) {
      throw new Error('Google Gemini client is not configured. Please provide an API key.');
    }

    try {
      // Try with the updated model names first
      let model;
      try {
        model = this.client.getGenerativeModel({ model: 'gemini-1.5-pro' });
      } catch (error) {
        try {
          model = this.client.getGenerativeModel({ model: 'gemini-1.0-pro' });
        } catch (fallbackError) {
          // If both fail, just use a generic title
          console.error('Failed to initialize any Gemini model for title generation:', fallbackError);
          return 'New conversation';
        }
      }
      
      const prompt = `Generate a short, descriptive title (maximum 6 words) for a conversation that starts with this message: "${userMessage}". The title should be concise but accurately reflect the main topic. Return only the title text with no additional explanation or quotation marks.`;
      
      const result = await model.generateContent(prompt);
      const title = result.response.text().trim();
      
      return title || 'New conversation';
    } catch (error: any) {
      console.error('Error generating title with Google Generative AI:', error);
      return 'New conversation';
    }
  }
}