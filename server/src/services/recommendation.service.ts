import { Recommendation, InsertRecommendation } from "@shared/schema";
import { storageService } from "./storage.service";

export const recommendationService = {
  /**
   * Get all recommendations
   */
  async getAllRecommendations(): Promise<Recommendation[]> {
    return storageService.getRecommendations();
  },

  /**
   * Create a new recommendation
   */
  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    return storageService.createRecommendation(recommendation);
  }
};