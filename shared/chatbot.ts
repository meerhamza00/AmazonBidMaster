import { z } from 'zod';

// Available AI model providers
export const aiProviderSchema = z.enum([
  'openai',
  'anthropic',
  'gemini',
  'qwen',
  'mixtral',
  'local'
]);

export type AiProvider = z.infer<typeof aiProviderSchema>;

// Message role types
export const messageRoleSchema = z.enum(['system', 'user', 'assistant']);
export type MessageRole = z.infer<typeof messageRoleSchema>;

// Individual message schema
export const chatMessageSchema = z.object({
  id: z.string(),
  role: messageRoleSchema,
  content: z.string(),
  timestamp: z.number(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

// Chat conversation schema
export const chatConversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  messages: z.array(chatMessageSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type ChatConversation = z.infer<typeof chatConversationSchema>;

// Chat completion request schema
export const chatCompletionRequestSchema = z.object({
  provider: aiProviderSchema,
  messages: z.array(chatMessageSchema),
  conversationId: z.string().optional(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
});

export type ChatCompletionRequest = z.infer<typeof chatCompletionRequestSchema>;

// Chat settings schema
export const chatSettingsSchema = z.object({
  provider: aiProviderSchema.default('openai'),
  model: z.string().optional(), // Model name specific to the provider
  temperature: z.number().min(0).max(1).default(0.7),
  maxTokens: z.number().min(10).max(8000).default(1024),
});

export type ChatSettings = z.infer<typeof chatSettingsSchema>;

// PPC Expert specific context schema
export const ppcExpertContextSchema = z.object({
  platform: z.enum(['amazon', 'google', 'facebook', 'microsoft', 'tiktok']).default('amazon'),
  campaign_types: z.array(z.string()).default(['sponsored_products']),
  average_daily_budget: z.number().optional(),
  industry: z.string().optional(),
  main_goals: z.array(z.enum(['sales', 'brand_awareness', 'leads', 'traffic'])).default(['sales']),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
});

export type PpcExpertContext = z.infer<typeof ppcExpertContextSchema>;

// Expert context includes base PPC expert context + uploaded campaign data if available
export const expertContextSchema = z.object({
  ppc: ppcExpertContextSchema,
  has_campaign_data: z.boolean().default(false),
  campaign_count: z.number().default(0),
  date_range: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
});

export type ExpertContext = z.infer<typeof expertContextSchema>;