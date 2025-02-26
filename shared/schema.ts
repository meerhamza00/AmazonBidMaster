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

// Enhanced rule schema with advanced conditions
export const rules = pgTable("rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  conditions: jsonb("conditions").notNull(), // Array of condition groups
  action: text("action").notNull(),
  adjustment: decimal("adjustment").notNull(),
  timeConstraints: jsonb("time_constraints"), // Optional time-based constraints
  isActive: boolean("is_active").notNull().default(true),
  priority: integer("priority").notNull().default(0),
});

// Condition types
export const metricOperatorSchema = z.enum([
  "greater_than",
  "less_than",
  "equal_to",
  "not_equal_to",
  "between",
]);

export const timeframeSchema = z.enum([
  "last_24_hours",
  "last_7_days",
  "last_30_days",
  "custom_range",
]);

export const conditionSchema = z.object({
  metric: z.string(),
  operator: metricOperatorSchema,
  value: z.number(),
  value2: z.number().optional(), // For "between" operator
  timeframe: timeframeSchema.optional(),
});

export const conditionGroupSchema = z.object({
  conditions: z.array(conditionSchema),
  operator: z.enum(["AND", "OR"]),
});

// Time constraint schema
export const timeConstraintSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  daysOfWeek: z.array(z.number().min(0).max(6)),
});

// Update the rule schema
export const ruleSchema = createInsertSchema(rules).extend({
  conditions: z.array(conditionGroupSchema),
  timeConstraints: timeConstraintSchema.optional(),
});

// Recommendation schema remains unchanged
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  ruleId: integer("rule_id").notNull(),
  oldBid: decimal("old_bid").notNull(),
  newBid: decimal("new_bid").notNull(),
  justification: text("justification").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Define types
export type Campaign = typeof campaigns.$inferSelect;
export type Rule = typeof rules.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertCampaign = z.infer<typeof campaignSchema>;
export type InsertRule = z.infer<typeof ruleSchema>;
export type InsertRecommendation = z.infer<typeof recommendationSchema>;

// CSV validation schema
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

export const campaignSchema = createInsertSchema(campaigns);
export const recommendationSchema = createInsertSchema(recommendations);