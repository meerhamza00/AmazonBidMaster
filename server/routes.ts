import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { csvRowSchema, campaignSchema, ruleSchema } from "@shared/schema";
import { z } from "zod";

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
      const schema = z.array(csvRowSchema);
      const data = schema.parse(req.body);

      // Process CSV data and create campaigns
      const campaigns = data.map(row => ({
        name: row.campaignName,
        budget: row.spend.toString(), // Convert to string as per schema
        status: "active",
        metrics: {
          spend: row.spend,
          sales: row.sales,
          acos: row.acos,
          roas: row.roas,
          impressions: row.impressions,
          clicks: row.clicks,
          ctr: row.ctr,
          cpc: row.cpc,
          orders: row.orders
        }
      }));

      // Create campaigns in storage
      const results = await Promise.all(
        campaigns.map(campaign => storage.createCampaign(campaign))
      );

      res.json(results);
    } catch (error) {
      res.status(400).json({ error: "Invalid CSV data" });
    }
  });

  // Recommendations routes
  app.get("/api/recommendations", async (_req, res) => {
    const recommendations = await storage.getRecommendations();
    res.json(recommendations);
  });

  const httpServer = createServer(app);
  return httpServer;
}