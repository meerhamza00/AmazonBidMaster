import { Rule, InsertRule } from "@shared/schema";
import { validateRule as validateRuleLogic } from "@shared/services/rule-validation-service.refactored";
import { storageService } from "./storage.service";

export const ruleService = {
  /**
   * Get all rules
   */
  async getAllRules(): Promise<Rule[]> {
    return storageService.getRules();
  },

  /**
   * Get a rule by ID
   */
  async getRuleById(id: number): Promise<Rule | undefined> {
    return storageService.getRule(id);
  },

  /**
   * Create a new rule
   */
  async createRule(rule: InsertRule): Promise<Rule> {
    return storageService.createRule(rule);
  },

  /**
   * Update a rule
   */
  async updateRule(id: number, rule: Partial<Rule>): Promise<Rule> {
    return storageService.updateRule(id, rule);
  },

  /**
   * Validate a rule against campaigns and existing rules
   */
  async validateRule(rule: InsertRule) {
    const [campaigns, existingRules] = await Promise.all([
      storageService.getCampaigns(),
      storageService.getRules()
    ]);
    
    return validateRuleLogic(rule, campaigns, existingRules);
  }
};