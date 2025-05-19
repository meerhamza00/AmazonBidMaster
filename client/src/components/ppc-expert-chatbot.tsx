import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Send, User, Bot, MessageCircle, Settings, X, MoreVertical, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import type { AiProvider, ChatConversation, ChatMessage } from '../../../shared/chatbot';

// Type for AI model info from the API
interface AiModel {
  id: string;
  name: string;
  provider: AiProvider;
  configured: boolean;
  description: string;
  type: 'reasoning' | 'chat-based';
  recommended?: boolean;
}

// Type for conversation list item
interface ConversationListItem {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: number;
  updatedAt: number;
}

export default function PpcExpertChatbot() {
  const [message, setMessage] = useState("");
  // Always use gemini as default provider and gemini-1.5-flash as default model
  const GEMINI_DEFAULT_MODEL = 'gemini-1.5-flash';
  const [selectedProvider, setSelectedProvider] = useState<AiProvider>('gemini');
  const [selectedModel, setSelectedModel] = useState<string>(GEMINI_DEFAULT_MODEL);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  // State for rename dialog
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameConversationId, setRenameConversationId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  // Add state for system prompt customization
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch available AI models
  const { data: models = [] } = useQuery({
    queryKey: ["/api/chat/models"],
    queryFn: async () => {
      const response = await apiRequest<AiModel[]>("/api/chat/models");
      return response.data;
    },
  });

  // Fetch conversation list
  const { data: conversations = [], refetch: refetchConversations } = useQuery({
    queryKey: ['/api/chat/conversations'],
    queryFn: async () => {
      const response = await apiRequest<ConversationListItem[]>('/api/chat/conversations');
      return response.data;
    }
  });

  // Fetch active conversation if there is one
  const { data: activeConversation, refetch: refetchActiveConversation } = useQuery({
    queryKey: ['/api/chat/conversations', activeConversationId],
    queryFn: async () => {
      if (!activeConversationId) return null;
      const response = await apiRequest<ChatConversation>(`/api/chat/conversations/${activeConversationId}`);
      console.log('[DEBUG] Active conversation API response:', response.data);
      return response.data;
    },
    enabled: !!activeConversationId
  });

  // Debug log for rendering
  useEffect(() => {
    console.log('[DEBUG] Render activeConversation:', activeConversation);
  }, [activeConversation]);

  // Create a new conversation
  const createConversation = useMutation({
    mutationFn: async (message: string) => {
      console.log('[DEBUG] Creating conversation with:', {
        message,
        model: selectedModel,
        provider: selectedProvider,
        systemPrompt
      });
      const response = await apiRequest('/api/chat/conversations', {
        method: 'POST',
        data: { 
          message, 
          model: selectedModel,
          provider: selectedProvider,
          systemPrompt: systemPrompt || undefined
        }
      });
      console.log('[DEBUG] createConversation API response:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('[DEBUG] createConversation onSuccess:', data);
      setActiveConversationId(data.id);
      refetchConversations();
    },
    onError: (error: any) => {
      console.error('[DEBUG] Error creating conversation:', error);
      toast({
        title: 'Error creating conversation',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Send a message to an existing conversation
  const sendMessageToConversation = useMutation({
    mutationFn: async ({ message, conversationId }: { message: string; conversationId?: string }) => {
      try {
        const endpoint = conversationId 
          ? `/api/chat/messages/${conversationId}`
          : '/api/chat/messages';
        console.log('[DEBUG] Sending message to conversation:', {
          message,
          conversationId,
          endpoint,
          model: selectedModel,
          provider: selectedProvider,
          systemPrompt
        });
        const response = await apiRequest(endpoint, {
          method: 'POST',
          data: {
            message,
            model: selectedModel,
            provider: selectedProvider,
            systemPrompt: systemPrompt || undefined
          }
        });
        console.log('[DEBUG] sendMessageToConversation API response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('[DEBUG] Error sending message to conversation:', error);
        // Check if this is a quota error or API key issue
        if (error?.message?.includes('quota') || error?.message?.includes('API key')) {
          // Get available providers that are configured
          const configuredProviders = getUniqueProviders()
            .filter(p => models.some(m => m.provider === p && m.configured));
          
          // If we have other configured providers, try with a different one
          if (configuredProviders.length > 1) {
            // Find a different provider
            const backupProvider = configuredProviders.find(p => p !== selectedProvider) || 'gemini';
            
            // Get a recommended model for the backup provider
            const backupModel = getRecommendedModel(backupProvider as AiProvider) || '';
            
            toast({
              title: `${selectedProvider.toUpperCase()} service unavailable`,
              description: `Trying with ${backupProvider} instead...`,
            });
            
            // Switch to the backup provider and model
            setSelectedProvider(backupProvider as AiProvider);
            setSelectedModel(backupModel);
            
            // Use the endpoint with conversation ID in the URL path
            const endpoint = conversationId 
              ? `/api/chat/messages/${conversationId}`
              : '/api/chat/messages';
              
            // Retry with the new provider and model
            const retryResponse = await apiRequest(endpoint, {
              method: 'POST',
              data: {
                message,
                model: backupModel,
                provider: backupProvider
              }
            });
            return retryResponse.data;
          }
        }
        
        throw error;
      }
    },
    onSuccess: () => {
      console.log('[DEBUG] sendMessageToConversation onSuccess');
      refetchActiveConversation();
      refetchConversations();
    },
    onError: (error: any) => {
      console.error('[DEBUG] Error in sendMessageToConversation onError:', error);
      toast({
        title: 'Error sending message',
        description: error.message || 'Something went wrong. Try a different AI provider.',
        variant: 'destructive'
      });
    }
  });

  // Delete a conversation
  const deleteConversation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/chat/conversations/${id}`, {
        method: 'DELETE'
      });
      return id;
    },
    onSuccess: (id) => {
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
      refetchConversations();
    }
  });

  // Scroll to bottom of messages when they change or when typing status changes
  useEffect(() => {
    if (messagesEndRef.current) {
      const scrollContainer = messagesEndRef.current.closest('.scroll-area-viewport');
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100); // Small delay to ensure content is rendered
      } else {
        // Fallback if scroll-area-viewport not found
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [activeConversation, isTyping]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    console.log('[DEBUG] handleSendMessage called:', message);
    
    // Store the message before sending to clear the input faster
    const messageToSend = message;
    
    // Clear the input immediately for better UX
    setMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      if (activeConversationId) {
        // Send to existing conversation
        const result = await sendMessageToConversation.mutateAsync({ 
          message: messageToSend, 
          conversationId: activeConversationId 
        });
        console.log('[DEBUG] sendMessageToConversation result:', result);
      } else {
        // Create a new conversation
        const result = await createConversation.mutateAsync(messageToSend);
        console.log('[DEBUG] createConversation result:', result);
      }
      
      // Force scroll to bottom after message is sent
      setTimeout(() => {
        if (messagesEndRef.current) {
          const scrollContainer = messagesEndRef.current.closest('.scroll-area-viewport');
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          } else {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 200);
    } catch (error) {
      console.error('[DEBUG] Error in handleSendMessage:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Format timestamp to readable date
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format date for conversation list
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    // If today, show time
    if (date.toDateString() === today.toDateString()) {
      return formatTime(timestamp);
    }
    
    // If this year, show month and day
    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString();
  };

  // Get unique list of providers
  const getUniqueProviders = () => {
    const providers = models.map(model => model.provider);
    return [...new Set(providers)];
  };
  
  // Get models for the selected provider
  const getModelsForProvider = (provider: AiProvider) => {
    return models.filter(model => model.provider === provider);
  };
  
  // Get a recommended model for a provider
  const getRecommendedModel = (provider: AiProvider) => {
    const providerModels = getModelsForProvider(provider);
    const recommended = providerModels.find(model => model.recommended);
    return recommended?.id || (providerModels.length > 0 ? providerModels[0].id : null);
  };
  
  // Handle provider change
  const handleProviderChange = (newProvider: AiProvider) => {
    if (newProvider !== 'gemini') {
      // Only allow gemini
      setSelectedProvider('gemini');
      // Find recommended Gemini model
      const geminiModels = models.filter(m => m.provider === 'gemini');
      const recommendedGemini = geminiModels.find(m => m.recommended) || geminiModels[0];
      setSelectedModel(recommendedGemini ? recommendedGemini.id : GEMINI_DEFAULT_MODEL);
      return;
    }
    setSelectedProvider('gemini');
    const geminiModels = models.filter(m => m.provider === 'gemini');
    const recommendedGemini = geminiModels.find(m => m.recommended) || geminiModels[0];
    setSelectedModel(recommendedGemini ? recommendedGemini.id : GEMINI_DEFAULT_MODEL);
  };
  
  // In handleModelChange, only allow gemini models
  const handleModelChange = (newModel: string) => {
    const geminiModels = models.filter(m => m.provider === 'gemini');
    if (geminiModels.some(m => m.id === newModel)) {
      setSelectedModel(newModel);
    } else {
      // fallback to recommended
      const recommendedGemini = geminiModels.find(m => m.recommended) || geminiModels[0];
      setSelectedModel(recommendedGemini ? recommendedGemini.id : GEMINI_DEFAULT_MODEL);
    }
  };

  // Render message content with line breaks
  const renderMessageContent = (content: string) => {
    return content.split('\\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  // Rename Conversation Dialog
  const renderRenameDialog = () => (
    <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
      <DialogContent>
        <DialogTitle>Rename Conversation</DialogTitle>
        <Input
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          placeholder="Conversation name"
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (renameConversationId && renameValue.trim()) {
                await renameConversation(renameConversationId, renameValue.trim());
                setRenameDialogOpen(false);
              }
            }}
            disabled={!renameValue.trim()}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Add renameConversation function
  async function renameConversation(id: string, newTitle: string) {
    await apiRequest(`/api/chat/conversations/${id}/rename`, {
      method: 'POST',
      data: { title: newTitle }
    });
    refetchConversations();
  }

  // When models are loaded, always enforce gemini/gemini-1.5-flash as default if available
  useEffect(() => {
    console.log('[DEBUG] models loaded:', models);
    if (models.length > 0) {
      // Find recommended Gemini model
      const geminiModels = models.filter(m => m.provider === 'gemini');
      const recommendedGemini = geminiModels.find(m => m.recommended) || geminiModels[0];
      console.log('[DEBUG] geminiModels:', geminiModels);
      console.log('[DEBUG] recommendedGemini:', recommendedGemini);
      if (recommendedGemini) {
        if (selectedProvider !== 'gemini' || selectedModel !== recommendedGemini.id) {
          console.log('[DEBUG] Forcing provider/model to gemini:', recommendedGemini.id);
          setSelectedProvider('gemini');
          setSelectedModel(recommendedGemini.id);
        }
      }
    }
    // eslint-disable-next-line
  }, [models]);

  return (
    <div className={`fixed bottom-6 right-6 flex flex-col transition-all duration-300 z-50 
      ${isExpanded ? 'w-[40rem] h-[38rem]' : 'w-16 h-16'}`}>
      {/* Collapsed chat button */}
      {!isExpanded && (
        <Button 
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 rounded-full p-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-800 text-white hover:scale-105 border border-orange-200 dark:border-orange-900"
        >
          <MessageCircle size={28} />
        </Button>
      )}
      {/* Expanded chat interface */}
      {isExpanded && (
        <Card className="w-full h-full flex flex-col overflow-hidden shadow-xl border border-orange-200 dark:border-orange-900 bg-white dark:bg-zinc-900">
          {/* Header */}
          <div className="p-3 flex items-center justify-between border-b bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-900 text-white">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <MessageCircle size={22} />
              Amazon Bid Master Chat
            </div>
            {/* In the chat header (top right), show both Settings and Close Chat buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-orange-400 dark:hover:bg-orange-700"
                onClick={() => setShowModelSelector(true)}
                title="AI Model Settings"
              >
                <Settings size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-orange-400 dark:hover:bg-orange-700"
                onClick={() => setIsExpanded(false)}
                title="Close Chat"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
          {/* Main chat area with sidebar */}
          <div className="flex flex-1 overflow-hidden bg-orange-50 dark:bg-zinc-950">
            {/* Sidebar: Conversation List */}
            <div className="w-56 border-r bg-white dark:bg-zinc-900 dark:border-zinc-800 flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 border-b text-sm font-semibold text-orange-600 dark:text-orange-400 dark:border-zinc-800">
                Conversations
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-orange-500 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900"
                  onClick={() => {
                    setActiveConversationId(null);
                  }}
                  title="New Conversation"
                >
                  <Plus size={18} />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 && (
                  <div className="text-xs text-gray-400 dark:text-zinc-500 p-4 text-center">No conversations yet.</div>
                )}
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    className={`relative px-3 py-2 cursor-pointer border-b hover:bg-orange-100 dark:hover:bg-orange-900 transition-all ${activeConversationId === conv.id ? 'bg-orange-100 dark:bg-orange-900 font-bold' : 'dark:border-zinc-800'}`}
                    onClick={() => setActiveConversationId(conv.id)}
                  >
                    <div className="truncate text-sm dark:text-zinc-100">{conv.title || 'Untitled'}</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400 truncate">{conv.lastMessage}</div>
                    <div className="text-[10px] text-gray-400 dark:text-zinc-500 text-right">{formatDate(conv.updatedAt)}</div>
                    <div className="absolute right-2 top-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 dark:text-zinc-500 hover:text-orange-500 dark:hover:text-orange-400 p-1" onClick={e => e.stopPropagation()}>
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 border dark:border-zinc-800">
                          <DropdownMenuItem onSelect={e => { e.preventDefault(); setRenameConversationId(conv.id); setRenameValue(conv.title); setRenameDialogOpen(true); }} className="hover:bg-orange-50 dark:hover:bg-orange-900">
                            <Edit size={14} className="mr-2" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={e => { e.preventDefault(); deleteConversation.mutate(conv.id); }} className="hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400">
                            <Trash2 size={14} className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Main Chat Window */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              {activeConversation ? (
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-area-viewport">
                  {activeConversation.messages && activeConversation.messages.length > 0 ? (
                    activeConversation.messages.map((msg: ChatMessage, idx: number) => (
                      <div key={msg.id || idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm whitespace-pre-line text-sm ${msg.role === 'user' ? 'bg-orange-200 dark:bg-orange-800 text-right dark:text-orange-100' : 'bg-white dark:bg-zinc-800 border dark:border-zinc-700 text-left dark:text-zinc-100'}`}>
                          <div className="mb-1 text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            {msg.role === 'user' ? 'You' : 'AI'} · {formatTime(msg.timestamp)}
                          </div>
                          <div>{renderMessageContent(msg.content)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 dark:text-zinc-500 mt-10">Start a conversation to get Amazon PPC advice!</div>
                  )}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[70%] px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border dark:border-zinc-700 shadow-sm text-sm animate-pulse">
                        <div className="mb-1 text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                          <Bot size={14} /> AI is typing...
                        </div>
                        <div className="italic text-gray-400 dark:text-zinc-500">Thinking...</div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-zinc-500 text-lg">
                  Select or start a conversation to begin chatting.
                </div>
              )}
              {/* Input Box */}
              <form
                className="flex items-center gap-2 p-3 border-t bg-white dark:bg-zinc-900 dark:border-zinc-800"
                onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
              >
                <Input
                  className="flex-1 rounded-full bg-orange-50 dark:bg-zinc-800 border-orange-200 dark:border-zinc-700 focus:ring-orange-400 dark:focus:ring-orange-700 text-zinc-900 dark:text-zinc-100 placeholder:text-orange-400 dark:placeholder:text-orange-300"
                  placeholder="Ask about Amazon PPC..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  disabled={isTyping}
                  autoFocus
                />
                <Button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-900 text-white shadow-md hover:scale-105"
                  disabled={isTyping || !message.trim()}
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </div>
          {/* AI Model Settings Dialog */}
          <Dialog open={showModelSelector} onOpenChange={setShowModelSelector}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-900 border dark:border-zinc-800" aria-describedby="model-settings-desc">
              <DialogTitle className="dark:text-zinc-100">AI Model Settings</DialogTitle>
              <DialogDescription id="model-settings-desc" className="dark:text-zinc-400">
                Choose your preferred AI provider and model for chat responses.
              </DialogDescription>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1 dark:text-zinc-200">Provider</label>
                <select
                  className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-orange-200 dark:border-zinc-700"
                  value={selectedProvider}
                  disabled
                >
                  <option value="gemini">Gemini</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1 dark:text-zinc-200">Model</label>
                <select
                  className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-orange-200 dark:border-zinc-700"
                  value={selectedModel}
                  disabled
                >
                  <option value={GEMINI_DEFAULT_MODEL}>Gemini 1.5 Flash (Recommended)</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1 dark:text-zinc-200">System Prompt</label>
                <textarea
                  className="w-full border rounded px-2 py-1 min-h-[60px] bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-orange-200 dark:border-zinc-700"
                  value={systemPrompt}
                  onChange={e => setSystemPrompt(e.target.value)}
                  placeholder="Customize the chatbot's persona and behavior (optional)"
                />
                <div className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                  This prompt controls the chatbot's role and expertise. Leave blank for the default Amazon PPC & DSP assistant.
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setShowModelSelector(false)} type="button">Close</Button>
              </div>
            </DialogContent>
          </Dialog>
          {renderRenameDialog()}
        </Card>
      )}
    </div>
  );
}
