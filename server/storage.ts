import { campaigns, rules, recommendations, type Campaign, type Rule, type Recommendation, type InsertCampaign, type InsertRule, type InsertRecommendation } from "@shared/schema";

export interface IStorage {
  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  
  // Rule operations
  getRules(): Promise<Rule[]>;
  getRule(id: number): Promise<Rule | undefined>;
  createRule(rule: InsertRule): Promise<Rule>;
  updateRule(id: number, rule: Partial<Rule>): Promise<Rule>;
  
  // Recommendation operations
  getRecommendations(): Promise<Recommendation[]>;
  createRecommendation(rec: InsertRecommendation): Promise<Recommendation>;
}

export class MemStorage implements IStorage {
  private campaigns: Map<number, Campaign>;
  private rules: Map<number, Rule>;
  private recommendations: Map<number, Recommendation>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.campaigns = new Map();
    this.rules = new Map();
    this.recommendations = new Map();
    this.currentIds = {
      campaigns: 1,
      rules: 1,
      recommendations: 1,
    };
  }

  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentIds.campaigns++;
    const newCampaign = { ...campaign, id } as Campaign;
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }

  async getRules(): Promise<Rule[]> {
    return Array.from(this.rules.values());
  }

  async getRule(id: number): Promise<Rule | undefined> {
    return this.rules.get(id);
  }

  async createRule(rule: InsertRule): Promise<Rule> {
    const id = this.currentIds.rules++;
    const newRule = { ...rule, id } as Rule;
    this.rules.set(id, newRule);
    return newRule;
  }

  async updateRule(id: number, rule: Partial<Rule>): Promise<Rule> {
    const existingRule = this.rules.get(id);
    if (!existingRule) {
      throw new Error('Rule not found');
    }
    const updatedRule = { ...existingRule, ...rule };
    this.rules.set(id, updatedRule);
    return updatedRule;
  }

  async getRecommendations(): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values());
  }

  async createRecommendation(rec: InsertRecommendation): Promise<Recommendation> {
    const id = this.currentIds.recommendations++;
    const newRec = { ...rec, id } as Recommendation;
    this.recommendations.set(id, newRec);
    return newRec;
  }
}

export const storage = new MemStorage();
