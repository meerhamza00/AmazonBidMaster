import { Request, Response } from "express";
import { chatService } from "../services/chat.service";

export const chatController = {
  /**
   * Get all conversations
   */
  async getConversations(req: Request, res: Response) {
    try {
      const conversations = await chatService.getConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  },

  /**
   * Get a conversation by ID
   */
  async getConversation(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const conversation = await chatService.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  },

  /**
   * Create a new conversation
   */
  async createConversation(req: Request, res: Response) {
    try {
      const { title, model, message: initialMessage, systemPrompt } = req.body;
      console.log('[DEBUG] chat.controller.ts createConversation called with:', { title, model, initialMessage, systemPrompt });
      // Create the conversation first
      const conversation = await chatService.createConversation(title, model, systemPrompt);
      console.log('[DEBUG] chat.controller.ts conversation after createConversation:', conversation);
      // If an initial message is provided, add it and get AI reply
      if (initialMessage && initialMessage.trim()) {
        const aiReply = await chatService.sendMessage(conversation.id, initialMessage, model, systemPrompt);
        console.log('[DEBUG] chat.controller.ts AI reply to initial message:', aiReply);
      }
      // Return the updated conversation (with messages)
      const updatedConversation = await chatService.getConversation(conversation.id);
      console.log('[DEBUG] chat.controller.ts updatedConversation:', updatedConversation);
      res.json(updatedConversation);
    } catch (error) {
      console.error('[DEBUG] Error creating conversation:', error);
      res.status(400).json({ error: "Failed to create conversation" });
    }
  },

  /**
   * Send a message in a conversation
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const conversationId = req.params.id || req.body.conversationId;
      const { message, model, systemPrompt } = req.body;
      console.log('[DEBUG] chat.controller.ts sendMessage called with:', { conversationId, message, model, systemPrompt });
      if (!conversationId) {
        return res.status(400).json({ error: "Conversation ID is required" });
      }
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      const response = await chatService.sendMessage(conversationId, message, model, systemPrompt);
      console.log('[DEBUG] chat.controller.ts sendMessage response:', response);
      res.json(response);
    } catch (error) {
      console.error('[DEBUG] Error sending message:', error);
      res.status(500).json({ error: "Failed to send message" });
    }
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await chatService.deleteConversation(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  },

  /**
   * Get available AI models
   */
  async getModels(req: Request, res: Response) {
    try {
      const models = await chatService.getModels();
      res.json(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ error: "Failed to fetch models" });
    }
  },

  /**
   * Rename a conversation
   */
  async renameConversation(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { title } = req.body;
      if (!id || !title || !title.trim()) {
        return res.status(400).json({ error: "Conversation ID and new title are required" });
      }
      const conversation = await chatService.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      conversation.title = title.trim();
      conversation.updatedAt = Date.now();
      res.json(conversation);
    } catch (error) {
      console.error("Error renaming conversation:", error);
      res.status(500).json({ error: "Failed to rename conversation" });
    }
  }
};