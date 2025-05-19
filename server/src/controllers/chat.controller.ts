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
      const { title, model } = req.body;
      const conversation = await chatService.createConversation(title, model);
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(400).json({ error: "Failed to create conversation" });
    }
  },

  /**
   * Send a message in a conversation
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const conversationId = req.params.id || req.body.conversationId;
      const { message, model } = req.body;
      
      if (!conversationId) {
        return res.status(400).json({ error: "Conversation ID is required" });
      }
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      const response = await chatService.sendMessage(conversationId, message, model);
      res.json(response);
    } catch (error) {
      console.error("Error sending message:", error);
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
  }
};