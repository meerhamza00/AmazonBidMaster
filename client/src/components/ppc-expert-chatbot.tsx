import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
// Import types from shared module
import type { 
  AiProvider, 
  ChatMessage, 
  ChatConversation 
} from '@shared/chatbot';
import { 
  MessageCircle, 
  Send, 
  RotateCw, 
  Bot,
  User,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// Type for AI model info from the API
interface AiModel {
  id: AiProvider;
  name: string;
  configured: boolean;
  description: string;
}

// Type for conversation list item
interface ConversationListItem {
  id: string;
  title: string;
  preview: string;
  createdAt: number;
  updatedAt: number;
}

export default function PpcExpertChatbot() {
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState<AiProvider>('openai');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch available AI models
  const { data: models = [] } = useQuery({
    queryKey: ['/api/chat/models'],
    queryFn: async () => {
      const response = await apiRequest<AiModel[]>('/api/chat/models');
      return response.data;
    }
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
      return response.data;
    },
    enabled: !!activeConversationId
  });

  // Create a new conversation
  const createConversation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('/api/chat/conversations', {
        method: 'POST',
        data: { message, provider }
      });
      return response.data;
    },
    onSuccess: (data) => {
      setActiveConversationId(data.id);
      refetchConversations();
    },
    onError: (error: any) => {
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
        const response = await apiRequest('/api/chat/messages', {
          method: 'POST',
          data: {
            message,
            conversationId,
            provider
          }
        });
        return response.data;
      } catch (error: any) {
        // Check if this is a quota error (OpenAI)
        if (error?.message?.includes('quota') && provider === 'openai') {
          // Try with a different provider automatically
          const backupProvider = 'anthropic';
          toast({
            title: 'OpenAI quota exceeded',
            description: `Trying with ${backupProvider} instead...`,
          });
          
          // Switch to the backup provider
          setProvider(backupProvider as AiProvider);
          
          // Retry with the new provider
          const retryResponse = await apiRequest('/api/chat/messages', {
            method: 'POST',
            data: {
              message,
              conversationId,
              provider: backupProvider
            }
          });
          return retryResponse.data;
        }
        
        throw error;
      }
    },
    onSuccess: () => {
      refetchActiveConversation();
      refetchConversations();
    },
    onError: (error: any) => {
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
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Small delay to ensure content is rendered
    }
  }, [activeConversation, isTyping]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add a temporary user message to the UI
    const tempUserMessage: ChatMessage = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: message,
      timestamp: Date.now()
    };
    
    setIsTyping(true);
    
    try {
      if (activeConversationId) {
        // Send to existing conversation
        await sendMessageToConversation.mutateAsync({ 
          message, 
          conversationId: activeConversationId 
        });
      } else {
        // Create a new conversation
        await createConversation.mutateAsync(message);
      }
      
      // Clear the input
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
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

  // Change provider and reset conversation
  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider as AiProvider);
    // Optionally reset conversation when changing models
    // setActiveConversationId(null);
  };

  // Get available providers (with proper status)
  const availableProviders = models.map((model: AiModel) => ({
    id: model.id,
    name: model.name,
    configured: model.configured,
    description: model.description
  }));

  // Render message content with line breaks
  const renderMessageContent = (content: string) => {
    return content.split('\\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className={`fixed bottom-6 right-6 flex flex-col transition-all duration-300 z-50 
      ${isExpanded ? 'w-[40rem] h-[38rem]' : 'w-16 h-16'}`}>
      
      {/* Collapsed chat button */}
      {!isExpanded && (
        <Button 
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 rounded-full p-0 shadow-lg"
        >
          <MessageCircle size={24} />
        </Button>
      )}
      
      {/* Expanded chat interface */}
      {isExpanded && (
        <Card className="w-full h-full flex flex-col overflow-hidden shadow-xl border-2 border-orange-500">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b bg-orange-500 text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h2 className="font-semibold">Amazon PPC Expert</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-orange-600"
                onClick={() => setIsExpanded(false)}
              >
                <X size={18} />
              </Button>
            </div>
          </div>
          
          {/* Main chat area with sidebar */}
          <div className="flex flex-1 overflow-hidden">
            {/* Conversation list sidebar */}
            <div className="w-1/3 border-r border-border bg-muted/20 hidden md:block">
              <div className="p-3 border-b">
                <h3 className="font-medium text-sm mb-2">Model</h3>
                <Select 
                  value={provider} 
                  onValueChange={handleProviderChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProviders.map((model: AiModel) => (
                      <SelectItem 
                        key={model.id} 
                        value={model.id}
                        disabled={!model.configured}
                      >
                        {model.name}
                        {!model.configured && " (API Key Required)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-sm mb-2">Conversations</h3>
                {conversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground px-1">No conversations yet</p>
                ) : (
                  <ScrollArea className="h-[calc(100vh-15rem)]">
                    <div className="space-y-1">
                      {conversations.map((conv: ConversationListItem) => (
                        <div 
                          key={conv.id}
                          className={`p-2 rounded-md cursor-pointer hover:bg-muted flex justify-between items-start text-sm group
                            ${activeConversationId === conv.id ? 'bg-muted' : ''}`}
                          onClick={() => setActiveConversationId(conv.id)}
                        >
                          <div className="flex-1 mr-1 overflow-hidden">
                            <div className="font-medium truncate">{conv.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{conv.preview}</div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(conv.updatedAt)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation.mutate(conv.id);
                              }}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-4" type="always">
                {!activeConversation ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <Bot size={40} className="text-orange-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Amazon PPC Expert Assistant</h3>
                    <p className="text-muted-foreground mb-4 max-w-md">
                      Ask me any question about Amazon PPC advertising, campaign optimization,
                      bid strategies, or performance analysis.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 w-full max-w-md mt-4">
                      <div 
                        className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted"
                        onClick={() => setMessage("How do I improve my ACoS on Amazon PPC?")}
                      >
                        <p className="text-sm font-medium">How do I improve my ACoS?</p>
                      </div>
                      <div 
                        className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted"
                        onClick={() => setMessage("What's a good bidding strategy for new campaigns?")}
                      >
                        <p className="text-sm font-medium">Bidding strategy for new campaigns</p>
                      </div>
                      <div 
                        className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted"
                        onClick={() => setMessage("How should I structure my campaign hierarchy?")}
                      >
                        <p className="text-sm font-medium">Campaign structure advice</p>
                      </div>
                      <div 
                        className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted"
                        onClick={() => setMessage("How to analyze and optimize search term reports?")}
                      >
                        <p className="text-sm font-medium">Search term optimization</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeConversation.messages
                      .filter(msg => msg.role !== 'system') // Don't show system messages
                      .map((msg: ChatMessage) => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <Avatar className={`h-8 w-8 ${msg.role === 'user' ? 'bg-orange-500' : 'bg-primary'}`}>
                              {msg.role === 'user' ? (
                                <User className="h-5 w-5" />
                              ) : (
                                <Bot className="h-5 w-5" />
                              )}
                            </Avatar>
                            <div>
                              <div className={`rounded-lg px-4 py-3 text-sm ${
                                msg.role === 'user' ? 'bg-orange-500 text-white' : 'bg-muted'
                              }`}>
                                {renderMessageContent(msg.content)}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 mx-1">
                                {formatTime(msg.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[80%]">
                          <Avatar className="h-8 w-8 bg-primary">
                            <Bot className="h-5 w-5" />
                          </Avatar>
                          <div>
                            <div className="rounded-lg px-4 py-3 text-sm bg-muted">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                                <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-150"></div>
                                <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-300"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
              
              {/* Message input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything about Amazon PPC..."
                    className="resize-none min-h-[3rem]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isTyping}
                    className="h-auto"
                  >
                    {isTyping ? <RotateCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                  <div>
                    <span>Press Enter to send, Shift+Enter for new line</span>
                  </div>
                  <div>
                    <Badge variant="outline">
                      Using {models.find((m: AiModel) => m.id === provider)?.name || provider}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}