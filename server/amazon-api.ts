
import axios from "axios";

export class AmazonAdvertisingAPI {
  private baseUrl = "https://advertising-api.amazon.com";
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getCampaigns() {
    const response = await axios.get(`${this.baseUrl}/v2/campaigns`, {
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Amazon-Advertising-API-ClientId": process.env.AMAZON_CLIENT_ID
      }
    });
    return response.data;
  }

  async updateCampaignBid(campaignId: string, bid: number) {
    const response = await axios.put(`${this.baseUrl}/v2/campaigns/${campaignId}`, {
      bid: bid
    }, {
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Amazon-Advertising-API-ClientId": process.env.AMAZON_CLIENT_ID
      }
    });
    return response.data;
  }
}
