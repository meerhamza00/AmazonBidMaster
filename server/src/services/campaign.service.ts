import { Campaign, InsertCampaign } from "@shared/schema";
import { generateBidPrediction } from "@shared/ml/bidOptimizer.refactored";
import { generateCampaignForecast } from "@shared/ml/forecasting.refactored";
import { storageService } from "./storage.service";

export const campaignService = {
  /**
   * Get all campaigns
   */
  async getAllCampaigns(): Promise<Campaign[]> {
    return storageService.getCampaigns();
  },

  /**
   * Get a campaign by ID
   */
  async getCampaignById(id: number): Promise<Campaign | undefined> {
    return storageService.getCampaign(id);
  },

  /**
   * Create a new campaign
   */
  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    return storageService.createCampaign(campaign);
  },

  /**
   * Get bid prediction for a campaign with customization options
   */
  async getBidPrediction(campaignId: number, targetAcos?: number) {
    const campaign = await storageService.getCampaign(campaignId);

    if (!campaign) {
      throw new Error("Campaign not found");
    }

    return generateBidPrediction(campaign, targetAcos);
  },

  /**
   * Get bulk bid predictions for all campaigns with customization options
   */
  async getBulkBidPredictions(targetAcos?: number) {
    const campaigns = await storageService.getCampaigns();
    return campaigns.map(campaign => generateBidPrediction(campaign, targetAcos));
  },

  /**
   * Get forecast for a campaign with customization options
   */
  async getCampaignForecast(campaignId: number, days?: number) {
    const campaign = await storageService.getCampaign(campaignId);

    if (!campaign) {
      throw new Error("Campaign not found");
    }

    return generateCampaignForecast(campaign, days);
  }
};