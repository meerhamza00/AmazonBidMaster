import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIServiceInterface, ChatMessage } from "../types";

export class GeminiService implements AIServiceInterface {
  private client: GoogleGenerativeAI;
  private model: string;
  
  constructor(model: string = 'gemini-pro') {
    this.client = new GoogleGenerativeAI(
      process.env.GOOGLE_API_KEY || 'dummy-key'
    );
    this.model = model;
  }
  
  /**
   * Generate a response from the Google Gemini API
   */
  async generateResponse(messages: ChatMessage[]): Promise<string> {
    try {
      console.log('[DEBUG][GeminiService.refactored] generateResponse called with messages:', messages);
      const geminiModel = this.client.getGenerativeModel({ model: this.model });
      const chat = geminiModel.startChat();
      
      // Process each message in the conversation
      for (const msg of messages) {
        if (msg.role === 'user') {
          console.log('[DEBUG][GeminiService.refactored] Sending user message to Gemini:', msg.content);
          await chat.sendMessage(msg.content);
        }
        if (msg.role === 'system') {
          console.log('[DEBUG][GeminiService.refactored] Sending system prompt to Gemini:', msg.content);
          await chat.sendMessage(msg.content);
        }
      }
      
      // Get response for the last user message
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      if (!lastUserMessage) {
        return 'No user message found';
      }
      
      console.log('[DEBUG][GeminiService.refactored] Getting response for last user message:', lastUserMessage.content);
      const result = await chat.sendMessage(lastUserMessage.content);
      console.log('[DEBUG][GeminiService.refactored] Gemini LLM response:', result.response.text());
      return result.response.text();
    } catch (error) {
      console.error('Google Gemini API error:', error);
      return 'Sorry, I encountered an error while generating a response.';
    }
  }
  
  /**
   * Generate a title for a conversation based on the first message
   */
  async generateTitle(message: string): Promise<string> {
    try {
      const geminiModel = this.client.getGenerativeModel({ model: this.model });
      const result = await geminiModel.generateContent(
        `Generate a short, concise title (max 6 words) for a conversation that starts with this message: "${message}"`
      );
      
      return result.response.text() || 'New Conversation';
    } catch (error) {
      console.error('Google Gemini API error generating title:', error);
      return 'New Conversation';
    }
  }
}