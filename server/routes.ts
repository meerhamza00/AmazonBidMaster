import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { csvRowSchema, campaignSchema, ruleSchema } from "@shared/schema";
import { z } from "zod";
import { generateBidPrediction } from "@shared/ml/bidOptimizer";
import { generateCampaignForecast } from "@shared/ml/forecasting";

export async function registerRoutes(app: Express): Promise<Server> {
  // Campaign routes
  app.get("/api/campaigns", async (_req, res) => {
    const campaigns = await storage.getCampaigns();
    res.json(campaigns);
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaign = campaignSchema.parse(req.body);
      const result = await storage.createCampaign(campaign);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid campaign data" });
    }
  });

  // Rule routes
  app.get("/api/rules", async (_req, res) => {
    const rules = await storage.getRules();
    res.json(rules);
  });

  app.post("/api/rules", async (req, res) => {
    try {
      const rule = ruleSchema.parse(req.body);
      const result = await storage.createRule(rule);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid rule data" });
    }
  });

  app.patch("/api/rules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rule = await storage.updateRule(id, req.body);
      res.json(rule);
    } catch (error) {
      res.status(404).json({ error: "Rule not found" });
    }
  });

  // CSV upload endpoint
  app.post("/api/upload-csv", async (req, res) => {
    try {
      // Parse CSV file content from FormData
      const fileContent = req.body.file;
      if (!fileContent) {
        return res.status(400).json({ error: "No file content provided" });
      }

      // Parse CSV rows into array of objects
      const rows = fileContent.split('\n')
        .filter(line => line.trim())
        .map((line, index) => {
          try {
            const values = line.split(',').map(val => val.trim());
            
            // Skip header row if present
            if (index === 0 && isNaN(parseFloat(values[3]))) {
              return null;
            }

            const [
              campaignName, portfolioName, campaignState, bid, 
              adGroupDefaultBid, spend, sales, orders, 
              clicks, roas, impressions
            ] = values;

            // Convert and validate numeric values
            const parsedBid = parseFloat(bid) || 0;
            const parsedAdGroupBid = parseFloat(adGroupDefaultBid) || 0;
            const parsedSpend = parseFloat(spend) || 0;
            const parsedSales = parseFloat(sales) || 0;
            const parsedOrders = parseInt(orders) || 0;
            const parsedClicks = parseInt(clicks) || 0;
            const parsedRoas = parseFloat(roas) || 0;
            const parsedImpressions = parseInt(impressions) || 0;

            return {
              campaignName: campaignName || '',
              portfolioName: portfolioName || '',
              campaignState: campaignState || '',
              bid: parsedBid,
              adGroupDefaultBid: parsedAdGroupBid,
              spend: parsedSpend,
              sales: parsedSales,
              orders: parsedOrders,
              clicks: parsedClicks,
              roas: parsedRoas,
              impressions: parsedImpressions
            };
          } catch (error) {
            console.error(`Error parsing row ${index + 1}:`, error);
            return null;
          }
        })
        .filter(row => row !== null);

      const schema = z.array(csvRowSchema);
      const data = schema.parse(rows);

      // Process CSV data and create campaigns
      const campaigns = data.map(row => {
        // Calculate CTR from clicks and impressions
        const ctr = row.clicks > 0 ? (row.clicks / row.impressions) * 100 : 0;
        // Calculate ACOS from spend and sales
        const acos = row.sales > 0 ? (row.spend / row.sales) * 100 : 0;
        // Calculate CPC from spend and clicks
        const cpc = row.clicks > 0 ? row.spend / row.clicks : 0;

        return {
          name: row.campaignName,
          budget: row.bid.toString(), // Use bid as budget
          status: row.campaignState,
          metrics: {
            spend: row.spend,
            sales: row.sales,
            acos: acos,
            roas: row.roas,
            impressions: row.impressions,
            clicks: row.clicks,
            ctr: ctr,
            cpc: cpc,
            orders: row.orders
          }
        };
      });

      // Create campaigns in storage
      const results = await Promise.all(
        campaigns.map(campaign => storage.createCampaign(campaign))
      );

      res.json(results);
    } catch (error) {
      console.error('CSV Upload Error:', error);
      res.status(400).json({ error: "Invalid CSV data" });
    }
  });

  // Recommendations routes
  app.get("/api/recommendations", async (_req, res) => {
    const recommendations = await storage.getRecommendations();
    res.json(recommendations);
  });

  // Campaign forecast endpoint
  app.get("/api/campaigns/:id/forecast", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaign = await storage.getCampaign(campaignId);

      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      const forecast = generateCampaignForecast(campaign);
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate forecast" });
    }
  });

  // ML-based bid optimization endpoints
  app.get("/api/campaigns/:id/bid-prediction", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaign = await storage.getCampaign(campaignId);

      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      const prediction = generateBidPrediction(campaign);
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate bid prediction" });
    }
  });

  app.get("/api/campaigns/bulk-bid-predictions", async (_req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      const predictions = campaigns.map(campaign => generateBidPrediction(campaign));
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate bulk bid predictions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}