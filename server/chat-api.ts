import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ChatCompletionRequest, ChatMessage, chatMessageSchema } from '../shared/chatbot';
import { getAiService, createPpcExpertSystemMessage } from '../shared/services/ai-service';
import { z } from 'zod';

// In-memory storage for chat conversations
// In a production app, this would be stored in a database
const conversations = new Map<string, { 
  id: string,
  title: string,
  messages: ChatMessage[],
  createdAt: number,
  updatedAt: number 
}>();

// Generate a new chat message
export function createChatMessage(role: 'system' | 'user' | 'assistant', content: string): ChatMessage {
  return {
    id: uuidv4(),
    role,
    content,
    timestamp: Date.now()
  };
}

// Get conversations (for listing in UI)
export async function getConversations(req: Request, res: Response) {
  try {
    const conversationList = Array.from(conversations.values()).map(conv => ({
      id: conv.id,
      title: conv.title,
      preview: conv.messages.find(m => m.role === 'user')?.content.substring(0, 100) || '',
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    }));
    
    // Sort by updatedAt, newest first
    conversationList.sort((a, b) => b.updatedAt - a.updatedAt);
    
    res.json(conversationList);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
}

// Get a single conversation by ID
export async function getConversation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const conversation = conversations.get(id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json(conversation);
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ error: 'Failed to retrieve conversation' });
  }
}

// Create a new conversation
export async function createConversation(req: Request, res: Response) {
  try {
    const body = req.body;
    const schemaResult = z.object({
      message: z.string().min(1),
      provider: z.string()
    }).safeParse(body);
    
    if (!schemaResult.success) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    
    const { message, provider } = schemaResult.data;
    
    // Create a new conversation with system message and user's first message
    const conversationId = uuidv4();
    const systemMessage = createChatMessage('system', createPpcExpertSystemMessage());
    const userMessage = createChatMessage('user', message);
    
    // Generate a title for the conversation based on the user's message
    let title = 'New Conversation';
    try {
      const aiService = await getAiService(provider as any);
      title = await aiService.generateTitle(message);
    } catch (error) {
      console.error('Error generating title:', error);
    }
    
    // Create conversation object
    const conversation = {
      id: conversationId,
      title,
      messages: [systemMessage, userMessage],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Store conversation
    conversations.set(conversationId, conversation);
    
    res.status(201).json({
      id: conversationId,
      title,
      messages: [userMessage] // Only return the user message, not the system message
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
}

// Send a message and get a response
export async function sendMessage(req: Request, res: Response) {
  try {
    const requestSchema = z.object({
      conversationId: z.string().optional(),
      message: z.string().min(1),
      provider: z.string(),
    });
    
    const parseResult = requestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    
    const { conversationId, message, provider } = parseResult.data;
    
    // Create new conversation if no ID is provided
    let conversation;
    if (!conversationId) {
      const systemMessage = createChatMessage('system', createPpcExpertSystemMessage());
      const userMessage = createChatMessage('user', message);
      
      const newId = uuidv4();
      conversation = {
        id: newId,
        title: 'New Conversation',
        messages: [systemMessage, userMessage],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      conversations.set(newId, conversation);
    } else {
      // Get existing conversation
      conversation = conversations.get(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      // Add user message to conversation
      const userMessage = createChatMessage('user', message);
      conversation.messages.push(userMessage);
      conversation.updatedAt = Date.now();
    }
    
    // Get AI service for the specified provider
    let aiService;
    let response;
    let usedFallbackProvider = false;
    let fallbackProvider;
    
    try {
      aiService = await getAiService(provider as any);
      
      // Check if service is configured (API key available)
      if (!aiService.isConfigured()) {
        return res.status(400).json({ 
          error: `${provider} API key not configured. Please provide the API key.`
        });
      }
      
      // Try sending messages to the primary AI service
      response = await aiService.sendMessages(conversation.messages);
    } catch (error: any) {
      console.error(`Error with ${provider} service:`, error);
      
      // Try to find an alternative provider that is configured
      if (provider === 'openai') {
        fallbackProvider = 'anthropic';
      } else if (provider === 'anthropic') {
        fallbackProvider = 'gemini';
      } else {
        fallbackProvider = 'openai';
      }
      
      try {
        // Get the fallback service
        console.log(`Attempting to use fallback provider: ${fallbackProvider}`);
        const fallbackService = await getAiService(fallbackProvider as any);
        
        if (fallbackService.isConfigured()) {
          // Try with the fallback service
          response = await fallbackService.sendMessages(conversation.messages);
          usedFallbackProvider = true;
          console.log(`Successfully used fallback provider: ${fallbackProvider}`);
        } else {
          // If fallback isn't configured either, throw original error
          throw error;
        }
      } catch (fallbackError) {
        // If both primary and fallback fail, return the original error
        console.error('Fallback provider also failed:', fallbackError);
        throw error;
      }
    }
    
    // Add assistant response to conversation
    const assistantMessage = createChatMessage('assistant', response);
    conversation.messages.push(assistantMessage);
    conversation.updatedAt = Date.now();
    
    // Generate title if it's a new conversation and doesn't have a real title
    if (conversation.title === 'New Conversation') {
      try {
        // Determine which provider to use for title generation
        let titleProvider = provider;
        if (usedFallbackProvider && fallbackProvider) {
          titleProvider = fallbackProvider;
        }
        
        // Get the appropriate service for title generation
        const titleService = await getAiService(titleProvider as any);
        
        try {
          const title = await titleService.generateTitle(message);
          conversation.title = title;
        } catch (error) {
          // If title generation fails, try with another provider if possible
          if (!usedFallbackProvider && fallbackProvider) {
            try {
              const backupTitleService = await getAiService(fallbackProvider as any);
              if (backupTitleService.isConfigured()) {
                const title = await backupTitleService.generateTitle(message);
                conversation.title = title;
              }
            } catch (secondError) {
              console.error('Backup title generation failed:', secondError);
            }
          } else {
            console.error('Error generating title:', error);
          }
        }
      } catch (error) {
        console.error('Error in title generation process:', error);
      }
    }
    
    // Update conversation in storage
    conversations.set(conversation.id, conversation);
    
    // Return the response
    res.json({
      id: conversation.id,
      response: assistantMessage
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
}

// Delete a conversation
export async function deleteConversation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    if (!conversations.has(id)) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    conversations.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
}

// Get information about available AI models
export async function getModels(req: Request, res: Response) {
  try {
    // Check which models we have API keys for
    const models = [
      {
        id: 'openai',
        name: 'OpenAI GPT-4o',
        configured: !!process.env.OPENAI_API_KEY,
        description: 'Advanced multimodal AI capable of processing text and images'
      },
      {
        id: 'anthropic',
        name: 'Anthropic Claude 3.7 Sonnet',
        configured: !!process.env.ANTHROPIC_API_KEY,
        description: 'A thoughtful, conversational AI assistant with impressive reasoning'
      },
      {
        id: 'gemini',
        name: 'Google Gemini Pro',
        configured: !!process.env.GOOGLE_API_KEY,
        description: 'Google\'s multimodal AI model with strong reasoning capabilities'
      }
    ];
    
    res.json(models);
  } catch (error) {
    console.error('Error getting models:', error);
    res.status(500).json({ error: 'Failed to retrieve model information' });
  }
}