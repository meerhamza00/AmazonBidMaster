import { AiProvider, ChatMessage, ChatSettings } from '../chatbot';
import { OpenAiService } from './openai-service';
import { AnthropicService } from './anthropic-service';
import { GeminiService } from './gemini-service';

// Base interface for all AI service implementations
export interface AiService {
  provider: AiProvider;
  
  // Send messages to the AI and get a response
  sendMessages(messages: ChatMessage[], settings?: Partial<ChatSettings>): Promise<string>;
  
  // Generate a title for a conversation based on the first user message
  generateTitle(userMessage: string): Promise<string>;
  
  // Check if the service is properly configured (API keys available, etc.)
  isConfigured(): boolean;
}

// Cache for AI service instances
const serviceInstances: Partial<Record<AiProvider, AiService>> = {
  'openai': new OpenAiService(),
  'anthropic': new AnthropicService(),
  'gemini': new GeminiService()
  // The remaining providers are not implemented yet
};

// Factory function to get the appropriate AI service based on provider
export async function getAiService(provider: AiProvider): Promise<AiService> {
  // Check if we have a cached instance
  if (serviceInstances[provider]) {
    return serviceInstances[provider] as AiService;
  }
  
  // If not cached, create a new instance based on the provider
  let service: AiService;
  
  switch (provider) {
    case 'openai':
      service = new OpenAiService();
      break;
    case 'anthropic':
      service = new AnthropicService();
      break;
    case 'gemini':
      service = new GeminiService();
      break;
    case 'qwen':
    case 'mixtral':
    case 'local':
      throw new Error(`AI provider '${provider}' is not implemented yet.`);
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
  
  // Cache the new instance
  serviceInstances[provider] = service;
  
  return service;
}

// Helper function to create a system message for the PPC expert context
export function createPpcExpertSystemMessage(): string {
  return `You are an Amazon PPC Expert with extensive experience in managing and optimizing Amazon Advertising campaigns.

Your role is to provide expert guidance on:
- Amazon sponsored ads campaign structure and optimization
- Keyword research and bid management strategies
- Budget allocation and pacing recommendations
- ACoS (Advertising Cost of Sale) and RoAS (Return on Ad Spend) optimization
- Interpreting performance metrics and trends
- Creative best practices for ad content
- Seasonal strategy adjustments and competitive analysis

Provide clear, actionable advice and be willing to explain the reasoning behind your recommendations. When appropriate, use examples to illustrate concepts.

If the user shares campaign data or metrics with you, analyze them carefully and provide targeted insights. If you need more information to give a helpful answer, ask clarifying questions.

Remember that your goal is to help advertisers improve their campaign performance and achieve their business objectives.`;
}