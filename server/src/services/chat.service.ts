import { v4 as uuidv4 } from 'uuid';
import { getAIService } from '@shared/services/ai-service.refactored';

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
}

// In-memory storage for conversations
const conversations = new Map<string, Conversation>();

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
   */
  async createConversation(title: string = '', model: string = 'gpt-4') {
    const id = uuidv4();
    const now = Date.now();
    
    // Generate a default title if none provided
    const defaultTitle = `Conversation ${conversations.size + 1}`;
    
    const conversation: Conversation = {
      id,
      title: title || defaultTitle,
      messages: [],
      model,
      createdAt: now,
      updatedAt: now
    };
    
    conversations.set(id, conversation);
    return conversation;
  },

  /**
   * Send a message in a conversation
   */
  async sendMessage(conversationId: string, message: string, model?: string) {
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
    
    // Get the appropriate AI service
    const aiService = getAIService(aiModel);
    
    // Generate AI response
    const aiResponse = await aiService.generateResponse(
      conversation.messages.map(m => ({ role: m.role, content: m.content }))
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
      { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
      { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' }
    ];
  }
};