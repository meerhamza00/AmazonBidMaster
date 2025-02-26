import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Campaign } from "@shared/schema";
import { ChevronDown, ChevronRight } from "lucide-react";
import BidOptimizer from "./bid-optimizer";

interface CampaignTableProps {
  campaigns: Campaign[];
}

type CampaignMetrics = {
  spend: number;
  sales: number;
  acos: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number;
};

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (campaignId: number) => {
    const newExpanded = new Set(expandedRows);
    if (expandedRows.has(campaignId)) {
      newExpanded.delete(campaignId);
    } else {
      newExpanded.add(campaignId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Campaign Name</TableHead>
            <TableHead>Spend</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead>ACOS</TableHead>
            <TableHead>ROAS</TableHead>
            <TableHead>Impressions</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>CTR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <React.Fragment key={campaign.id}>
              <TableRow
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleRow(campaign.id)}
              >
                <TableCell>
                  {expandedRows.has(campaign.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>${(campaign.metrics as CampaignMetrics).spend.toFixed(2)}</TableCell>
                <TableCell>${(campaign.metrics as CampaignMetrics).sales.toFixed(2)}</TableCell>
                <TableCell>{(campaign.metrics as CampaignMetrics).acos.toFixed(2)}%</TableCell>
                <TableCell>{(campaign.metrics as CampaignMetrics).roas.toFixed(2)}x</TableCell>
                <TableCell>{(campaign.metrics as CampaignMetrics).impressions}</TableCell>
                <TableCell>{(campaign.metrics as CampaignMetrics).clicks}</TableCell>
                <TableCell>{(campaign.metrics as CampaignMetrics).ctr.toFixed(2)}%</TableCell>
              </TableRow>
              {expandedRows.has(campaign.id) && (
                <TableRow key={`${campaign.id}-expanded`}>
                  <TableCell colSpan={9} className="p-4">
                    <BidOptimizer campaignId={campaign.id} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}