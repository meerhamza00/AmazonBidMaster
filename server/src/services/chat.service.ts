import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getAIService } from '@shared/services/ai-service.refactored';
import { fileURLToPath } from 'url';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
  systemPrompt?: string; // Optional custom system prompt
}

// ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory storage for conversations
const conversations = new Map<string, Conversation>();

// Load the default system prompt from file at startup
const SYSTEM_PROMPT_PATH = path.join(__dirname, '../system-prompt.txt');
let DEFAULT_SYSTEM_PROMPT = '';
try {
  DEFAULT_SYSTEM_PROMPT = fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf8')
    .replace(/^\/\/.*$/gm, '') // Remove comment lines
    .trim();
  console.log('[DEBUG] Loaded system prompt from file:', DEFAULT_SYSTEM_PROMPT.slice(0, 200));
} catch (err) {
  DEFAULT_SYSTEM_PROMPT = `You are Amazon Bid Master, an expert assistant for Amazon PPC and DSP advertising.\nYour job is to help Amazon sellers, advertisers, and PPC/DSP managers with campaign strategy, bid optimization, reporting, and best practices.\nAlways provide clear, actionable, and up-to-date advice about Amazon Ads, PPC, and DSP.\nIf a question is outside Amazon advertising, politely redirect the user back to Amazon advertising topics.`;
  console.warn('Warning: Could not load system prompt from file. Using fallback default.');
}

export const chatService = {
  /**
   * Get all conversations
   */
  async getConversations() {
    return Array.from(conversations.values()).map(({ messages, ...rest }) => ({
      ...rest,
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]?.content || ''
    }));
  },

  /**
   * Get a conversation by ID
   */
  async getConversation(id: string) {
    return conversations.get(id);
  },

  /**
   * Create a new conversation
   * Now also sends a greeting message as the first assistant message, based on the system prompt.
   */
  async createConversation(title: string = '', model: string = 'gemini-1.5-flash', systemPrompt?: string) {
    const id = uuidv4();
    const now = Date.now();
    const defaultTitle = `Conversation ${conversations.size + 1}`;
    const conversation: Conversation = {
      id,
      title: title || defaultTitle,
      messages: [],
      model,
      createdAt: now,
      updatedAt: now,
      systemPrompt: systemPrompt || DEFAULT_SYSTEM_PROMPT
    };
    console.log('[DEBUG] Creating new conversation:', { id, model, systemPrompt: systemPrompt || DEFAULT_SYSTEM_PROMPT });
    // Generate a greeting message using the system prompt
    const aiService = getAIService(model);
    // Compose a greeting instruction for the assistant
    const greetingInstruction = `Greet the user as the Amazon Advertising Assistant. Briefly introduce who you are, your expertise, and how you can help. Ask the user what they would like to discuss or optimize first. Be friendly, concise, and proactive.`;
    // The system prompt is always sent as the first message
    const systemPromptText = systemPrompt || DEFAULT_SYSTEM_PROMPT;
    const greetingPrompt = `${systemPromptText}\n\n${greetingInstruction}`;
    console.log('[DEBUG] Greeting prompt sent to LLM:', greetingPrompt.slice(0, 300));
    // Generate the greeting message from the model
    const greeting = await aiService.generateResponse([
      { role: 'system', content: greetingPrompt }
    ]);
    console.log('[DEBUG] Greeting message from LLM:', greeting);
    // Add the assistant's greeting as the first message
    conversation.messages.push({
      id: uuidv4(),
      role: 'assistant',
      content: greeting,
      timestamp: Date.now()
    });
    conversations.set(id, conversation);
    return conversation;
  },

  /**
   * Send a message in a conversation
   */
  async sendMessage(conversationId: string, message: string, model?: string, systemPromptOverride?: string) {
    const conversation = conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: Date.now()
    };
    conversation.messages.push(userMessage);
    // Use the specified model or the conversation's default
    const aiModel = model || conversation.model;
    // Enhance the default system prompt with the user-supplied prompt (if any)
    let systemPrompt = conversation.systemPrompt || DEFAULT_SYSTEM_PROMPT;
    if (systemPromptOverride && systemPromptOverride.trim()) {
      systemPrompt = `${DEFAULT_SYSTEM_PROMPT}\n\n[User instructions:]\n${systemPromptOverride.trim()}`;
    }
    // Get the appropriate AI service
    const aiService = getAIService(aiModel);
    // Generate AI response
    const aiResponse = await aiService.generateResponse(
      [
        { role: 'system', content: systemPrompt },
        ...conversation.messages.map(m => ({ role: m.role, content: m.content }))
      ]
    );
    // Add AI response
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now()
    };
    conversation.messages.push(assistantMessage);
    conversation.updatedAt = Date.now();
    // Update conversation title if it's the first message
    if (conversation.messages.length === 2 && !conversation.title) {
      conversation.title = await aiService.generateTitle(message);
    }
    return assistantMessage;
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string) {
    return conversations.delete(id);
  },

  /**
   * Get available AI models
   */
  async getModels() {
    return [
      // OpenAI models
      { 
        id: 'gpt-4o', 
        name: 'GPT-4o', 
        provider: 'openai',
        description: 'Most capable model for complex tasks',
        type: 'reasoning',
        configured: process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10,
        recommended: true
      },
      { 
        id: 'gpt-4-turbo', 
        name: 'GPT-4 Turbo', 
        provider: 'openai',
        description: 'Powerful reasoning with lower cost',
        type: 'reasoning',
        configured: process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10
      },
      { 
        id: 'gpt-4', 
        name: 'GPT-4', 
        provider: 'openai',
        description: 'Strong reasoning capabilities',
        type: 'reasoning',
        configured: process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10
      },
      { 
        id: 'gpt-3.5-turbo', 
        name: 'GPT-3.5 Turbo', 
        provider: 'openai',
        description: 'Fast and cost-effective',
        type: 'chat-based',
        configured: process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10
      },
      
      // Anthropic models
      { 
        id: 'claude-3-opus', 
        name: 'Claude 3 Opus', 
        provider: 'anthropic',
        description: 'Most powerful Claude model',
        type: 'reasoning',
        configured: process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.length > 10,
        recommended: true
      },
      { 
        id: 'claude-3-sonnet', 
        name: 'Claude 3 Sonnet', 
        provider: 'anthropic',
        description: 'Balanced performance and cost',
        type: 'reasoning',
        configured: process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.length > 10
      },
      { 
        id: 'claude-3-haiku', 
        name: 'Claude 3 Haiku', 
        provider: 'anthropic',
        description: 'Fast responses for simpler tasks',
        type: 'chat-based',
        configured: process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.length > 10
      },
      
      // Google models
      { 
        id: 'gemini-1.5-pro', 
        name: 'Gemini 1.5 Pro', 
        provider: 'gemini',
        description: 'Google\'s most capable model',
        type: 'reasoning',
        configured: process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.length > 10,
        recommended: false // Not recommended
      },
      { 
        id: 'gemini-1.5-flash', 
        name: 'Gemini 1.5 Flash', 
        provider: 'gemini',
        description: 'Fast and efficient responses',
        type: 'chat-based',
        configured: process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.length > 10,
        recommended: true // Flash is now recommended
      },
      { 
        id: 'gemini-1.0-pro', 
        name: 'Gemini 1.0 Pro', 
        provider: 'gemini',
        description: 'Balanced performance',
        type: 'reasoning',
        configured: process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.length > 10
      }
    ];
  }
};