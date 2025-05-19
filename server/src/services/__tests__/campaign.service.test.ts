import { describe, it, expect, vi, beforeEach } from 'vitest';
import { campaignService } from '../campaign.service';
import { storageService } from '../storage.service';
import { generateBidPrediction } from '@shared/ml/bidOptimizer.refactored';
import { generateCampaignForecast } from '@shared/ml/forecasting.refactored';

// Mock dependencies
vi.mock('../storage.service', () => ({
  storageService: {
    getCampaigns: vi.fn(),
    getCampaign: vi.fn(),
    createCampaign: vi.fn()
  }
}));

vi.mock('@shared/ml/bidOptimizer.refactored', () => ({
  generateBidPrediction: vi.fn()
}));

vi.mock('@shared/ml/forecasting.refactored', () => ({
  generateCampaignForecast: vi.fn()
}));

describe('Campaign Service', () => {
  const mockCampaign = {
    id: 1,
    name: 'Test Campaign',
    budget: '100',
    status: 'active',
    metrics: {
      spend: 50,
      sales: 200,
      acos: 25,
      roas: 4,
      impressions: 1000,
      clicks: 100,
      ctr: 10,
      cpc: 0.5,
      orders: 20
    }
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getAllCampaigns', () => {
    it('should return all campaigns', async () => {
      const mockCampaigns = [mockCampaign];
      vi.mocked(storageService.getCampaigns).mockResolvedValue(mockCampaigns);

      const result = await campaignService.getAllCampaigns();
      
      expect(storageService.getCampaigns).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCampaigns);
    });
  });

  describe('getCampaignById', () => {
    it('should return a campaign by id', async () => {
      vi.mocked(storageService.getCampaign).mockResolvedValue(mockCampaign);

      const result = await campaignService.getCampaignById(1);
      
      expect(storageService.getCampaign).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCampaign);
    });
  });

  describe('getBidPrediction', () => {
    it('should return bid prediction for a campaign', async () => {
      const mockPrediction = {
        campaignId: 1,
        currentBid: 0.5,
        suggestedBid: 0.6,
        confidence: 80,
        metrics: {
          predictedAcos: 20,
          predictedRoas: 5,
          predictedCtr: 12
        }
      };

      vi.mocked(storageService.getCampaign).mockResolvedValue(mockCampaign);
      vi.mocked(generateBidPrediction).mockReturnValue(mockPrediction);

      const result = await campaignService.getBidPrediction(1);
      
      expect(storageService.getCampaign).toHaveBeenCalledWith(1);
      expect(generateBidPrediction).toHaveBeenCalledWith(mockCampaign);
      expect(result).toEqual(mockPrediction);
    });

    it('should throw an error if campaign is not found', async () => {
      vi.mocked(storageService.getCampaign).mockResolvedValue(undefined);

      await expect(campaignService.getBidPrediction(999)).rejects.toThrow('Campaign not found');
    });
  });
});