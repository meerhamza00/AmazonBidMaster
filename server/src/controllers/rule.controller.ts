import { Request, Response } from "express";
import { ruleService } from "../services/rule.service";
import { ruleSchema } from "@shared/schema";

export const ruleController = {
  /**
   * Get all rules
   */
  async getAllRules(_req: Request, res: Response) {
    try {
      const rules = await ruleService.getAllRules();
      res.json(rules);
    } catch (error) {
      console.error("Error fetching rules:", error);
      res.status(500).json({ error: "Failed to fetch rules" });
    }
  },

  /**
   * Get a rule by ID
   */
  async getRuleById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const rule = await ruleService.getRuleById(id);

      if (!rule) {
        return res.status(404).json({ error: "Rule not found" });
      }

      res.json(rule);
    } catch (error) {
      console.error("Error fetching rule:", error);
      res.status(500).json({ error: "Failed to fetch rule" });
    }
  },

  /**
   * Create a new rule
   */
  async createRule(req: Request, res: Response) {
    try {
      const rule = ruleSchema.parse(req.body);
      const result = await ruleService.createRule(rule);
      res.json(result);
    } catch (error) {
      console.error("Error creating rule:", error);
      res.status(400).json({ error: "Invalid rule data" });
    }
  },

  /**
   * Update a rule
   */
  async updateRule(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const rule = await ruleService.updateRule(id, req.body);
      res.json(rule);
    } catch (error) {
      console.error("Error updating rule:", error);
      res.status(404).json({ error: "Rule not found" });
    }
  },

  /**
   * Validate a rule
   */
  async validateRule(req: Request, res: Response) {
    try {
      // First validate the rule structure
      const ruleResult = ruleSchema.safeParse(req.body);
      if (!ruleResult.success) {
        return res.status(400).json({ 
          error: "Invalid rule structure", 
          details: ruleResult.error
        });
      }
      
      // Validate the rule against campaigns and existing rules
      const validationResult = await ruleService.validateRule(ruleResult.data);
      res.json(validationResult);
    } catch (error) {
      console.error("Error validating rule:", error);
      res.status(500).json({ error: "Failed to validate rule" });
    }
  }
};