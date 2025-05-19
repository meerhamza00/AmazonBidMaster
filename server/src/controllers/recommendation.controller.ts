import { Request, Response } from "express";
import { recommendationService } from "../services/recommendation.service";

export const recommendationController = {
  /**
   * Get all recommendations
   */
  async getAllRecommendations(_req: Request, res: Response) {
    try {
      const recommendations = await recommendationService.getAllRecommendations();
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  },

  /**
   * Create a new recommendation
   */
  async createRecommendation(req: Request, res: Response) {
    try {
      const recommendation = await recommendationService.createRecommendation(req.body);
      res.json(recommendation);
    } catch (error) {
      console.error("Error creating recommendation:", error);
      res.status(400).json({ error: "Invalid recommendation data" });
    }
  }
};