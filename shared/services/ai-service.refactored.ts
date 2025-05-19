import { AIServiceInterface, ChatMessage } from "../types";
import { OpenAIService } from "./openai-service.refactored";
import { AnthropicService } from "./anthropic-service.refactored";
import { GeminiService } from "./gemini-service.refactored";

// Factory function to get the appropriate AI service based on model
export function getAIService(model: string): AIServiceInterface {
  // OpenAI models
  if (model.startsWith('gpt-')) {
    return new OpenAIService(model);
  }
  
  // Anthropic models
  if (model.startsWith('claude-')) {
    return new AnthropicService(model);
  }
  
  // Google models
  if (model.startsWith('gemini-')) {
    return new GeminiService(model);
  }
  
  // Default to OpenAI GPT-4
  console.warn(`Unknown model: ${model}, defaulting to gpt-4`);
  return new OpenAIService('gpt-4');
}