import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ChatCompletionRequest, ChatMessage, aiProviderSchema, chatMessageSchema } from '../shared/chatbot';
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
    // Get conversation ID from either params or body
    let id = req.params.id;
    
    // If no ID in params, try to get it from body (for backward compatibility)
    if (!id && req.body.conversationId) {
      id = req.body.conversationId;
    }
    
    const { message, provider } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }
    
    // Validate the provider is one we support
    try {
      aiProviderSchema.parse(provider);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid provider' });
    }
    
    // If no conversation ID was provided, return an error
    if (!id) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }
    
    // Get the conversation or return an error
    if (!conversations.has(id)) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const conversation = conversations.get(id)!;
    
    // Add user message to conversation
    const userMessage = createChatMessage('user', message);
    
    // If this is the first message to the conversation, ensure we have a system message
    if (!conversation.messages.some(msg => msg.role === 'system')) {
      // Add system message first
      const systemPrompt = createPpcExpertSystemMessage();
      const systemMessage = createChatMessage('system', systemPrompt);
      conversation.messages.push(systemMessage);
      conversation.messages.push(userMessage);
      conversation.updatedAt = Date.now();
    } else {
      // Just add the user message
      conversation.messages.push(userMessage);
      conversation.updatedAt = Date.now();
    }
    
    // Get AI service for the specified provider
    let response = '';
    let usedFallbackProvider = false;
    let fallbackProvider = '';
    const fallbackOrder = ['openai', 'anthropic', 'gemini']; // Order of preference for fallbacks
    
    // Try each provider in turn until one works or all fail
    const attemptedProviders = new Set<string>();
    let currentProvider = provider as string;
    let success = false;
    
    while (!success && attemptedProviders.size < fallbackOrder.length) {
      attemptedProviders.add(currentProvider);
      
      try {
        // Get the current AI service
        const aiService = await getAiService(currentProvider as any);
        
        // Check if service is configured (API key available)
        if (!aiService.isConfigured()) {
          console.log(`${currentProvider} API key not configured, trying next provider`);
          throw new Error(`${currentProvider} API key not configured`);
        }
        
        // Try sending messages to the current AI service
        response = await aiService.sendMessages(conversation.messages);
        success = true;
        
        // Mark if we're using a fallback provider
        if (currentProvider !== provider) {
          usedFallbackProvider = true;
          fallbackProvider = currentProvider;
          console.log(`Successfully used fallback provider: ${fallbackProvider}`);
        }
      } catch (error: any) {
        console.error(`Error with ${currentProvider} service:`, error);
        
        // Choose the next fallback provider that hasn't been tried yet
        let foundNext = false;
        for (const nextProvider of fallbackOrder) {
          if (!attemptedProviders.has(nextProvider)) {
            currentProvider = nextProvider;
            console.log(`Attempting to use fallback provider: ${currentProvider}`);
            foundNext = true;
            break;
          }
        }
        
        // If we've tried all providers, give up
        if (!foundNext) {
          break;
        }
      }
    }
    
    // If we couldn't get a successful response from any provider
    if (!success) {
      return res.status(500).json({ 
        error: "Failed to process message with any available AI provider. Please check API configurations."
      });
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
          console.error('Primary title generation failed, trying fallback');
          
          // Try each provider for title generation
          for (const backupProvider of fallbackOrder) {
            if (backupProvider !== titleProvider) {
              try {
                const backupTitleService = await getAiService(backupProvider as any);
                if (backupTitleService.isConfigured()) {
                  const title = await backupTitleService.generateTitle(message);
                  if (title) {
                    conversation.title = title;
                    break;
                  }
                }
              } catch (backupError) {
                console.error(`Backup title generation with ${backupProvider} failed`);
                // Continue to next provider
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in title generation process:', error);
        // Just keep the default title
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
        name: 'Google Gemini 1.5 Pro',
        configured: !!process.env.GOOGLE_API_KEY,
        description: 'Google\'s latest multimodal AI model with strong reasoning capabilities'
      }
    ];
    
    res.json(models);
  } catch (error) {
    console.error('Error getting models:', error);
    res.status(500).json({ error: 'Failed to retrieve model information' });
  }
}