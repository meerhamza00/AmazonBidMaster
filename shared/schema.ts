import { pgTable, text, serial, integer, decimal, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Campaign data schema
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  budget: decimal("budget").notNull(),
  status: text("status").notNull(),
  metrics: jsonb("metrics").notNull(), // Stores performance metrics
});

// Rule schema
export const rules = pgTable("rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  condition: text("condition").notNull(),
  metric: text("metric").notNull(),
  threshold: decimal("threshold").notNull(),
  action: text("action").notNull(),
  adjustment: decimal("adjustment").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// Bid recommendation schema
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  ruleId: integer("rule_id").notNull(),
  oldBid: decimal("old_bid").notNull(),
  newBid: decimal("new_bid").notNull(),
  justification: text("justification").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Define schemas for data validation
export const campaignSchema = createInsertSchema(campaigns);
export const ruleSchema = createInsertSchema(rules);
export const recommendationSchema = createInsertSchema(recommendations);

// Define types
export type Campaign = typeof campaigns.$inferSelect;
export type Rule = typeof rules.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertCampaign = z.infer<typeof campaignSchema>;
export type InsertRule = z.infer<typeof ruleSchema>;
export type InsertRecommendation = z.infer<typeof recommendationSchema>;

// CSV validation schema matching the input file structure
export const csvRowSchema = z.object({
  campaignName: z.string(),
  portfolioName: z.string(),
  campaignState: z.string(),
  bid: z.number(),
  adGroupDefaultBid: z.number(),
  spend: z.number(),
  sales: z.number(),
  orders: z.number(),
  clicks: z.number(),
  roas: z.number(),
  impressions: z.number(),
});

export type CsvRow = z.infer<typeof csvRowSchema>;