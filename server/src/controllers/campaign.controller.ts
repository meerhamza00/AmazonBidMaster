import { Request, Response } from "express";
import { campaignService } from "../services/campaign.service";
import { csvService } from "../services/csv.service";
import { z } from "zod";
import { campaignSchema, csvRowSchema } from "@shared/schema";

export const campaignController = {
  /**
   * Get all campaigns
   */
  async getAllCampaigns(_req: Request, res: Response) {
    try {
      const campaigns = await campaignService.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  },

  /**
   * Get a campaign by ID
   */
  async getCampaignById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const campaign = await campaignService.getCampaignById(id);

      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ error: "Failed to fetch campaign" });
    }
  },

  /**
   * Create a new campaign
   */
  async createCampaign(req: Request, res: Response) {
    try {
      const campaign = campaignSchema.parse(req.body);
      const result = await campaignService.createCampaign(campaign);
      res.json(result);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(400).json({ error: "Invalid campaign data" });
    }
  },

  /**
   * Upload CSV and create campaigns
   */
  async uploadCsv(req: Request, res: Response) {
    try {
      // Parse CSV file content from FormData
      const fileContent = req.body.file;
      if (!fileContent) {
        return res.status(400).json({ error: "No file content provided" });
      }

      // Process the CSV data
      const rows = csvService.parseCSV(fileContent);
      
      // Validate the CSV data
      const schema = z.array(csvRowSchema);
      const data = schema.parse(rows);

      // Transform CSV data to campaign objects
      const campaigns = csvService.transformToCampaigns(data);

      // Create campaigns in storage
      const results = await Promise.all(
        campaigns.map(campaign => campaignService.createCampaign(campaign))
      );

      res.json(results);
    } catch (error) {
      console.error('CSV Upload Error:', error);
      res.status(400).json({ error: "Invalid CSV data" });
    }
  },

  /**
   * Get bid prediction for a campaign with customization options
   */
  async getBidPrediction(req: Request, res: Response) {
    try {
      const campaignId = parseInt(req.params.id);
      
      // Get customization options from query parameters
      const targetAcos = req.query.targetAcos ? parseFloat(req.query.targetAcos as string) : undefined;
      
      // Validate parameters
      if (targetAcos !== undefined && (isNaN(targetAcos) || targetAcos <= 0 || targetAcos > 100)) {
        return res.status(400).json({ 
          error: "Invalid targetAcos parameter. Must be a number between 0 and 100." 
        });
      }
      
      const prediction = await campaignService.getBidPrediction(campaignId, targetAcos);
      res.json(prediction);
    } catch (error) {
      console.error("Error generating bid prediction:", error);
      res.status(500).json({ error: "Failed to generate bid prediction" });
    }
  },

  /**
   * Get bulk bid predictions for all campaigns with customization options
   */
  async getBulkBidPredictions(req: Request, res: Response) {
    try {
      // Get customization options from query parameters
      const targetAcos = req.query.targetAcos ? parseFloat(req.query.targetAcos as string) : undefined;
      
      // Validate parameters
      if (targetAcos !== undefined && (isNaN(targetAcos) || targetAcos <= 0 || targetAcos > 100)) {
        return res.status(400).json({ 
          error: "Invalid targetAcos parameter. Must be a number between 0 and 100." 
        });
      }
      
      const predictions = await campaignService.getBulkBidPredictions(targetAcos);
      res.json(predictions);
    } catch (error) {
      console.error("Error generating bulk bid predictions:", error);
      res.status(500).json({ error: "Failed to generate bulk bid predictions" });
    }
  },

  /**
   * Get forecast for a campaign with customization options
   */
  async getCampaignForecast(req: Request, res: Response) {
    try {
      const campaignId = parseInt(req.params.id);
      
      // Get customization options from query parameters
      const days = req.query.days ? parseInt(req.query.days as string) : undefined;
      
      // Validate parameters
      if (days !== undefined && (isNaN(days) || days < 7 || days > 90)) {
        return res.status(400).json({ 
          error: "Invalid days parameter. Must be a number between 7 and 90." 
        });
      }
      
      const forecast = await campaignService.getCampaignForecast(campaignId, days);
      res.json(forecast);
    } catch (error) {
      console.error("Error generating forecast:", error);
      res.status(500).json({ error: "Failed to generate forecast" });
    }
  }
};