import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Campaign } from "@shared/schema";

interface CampaignTableProps {
  campaigns: Campaign[];
}

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>${campaign.metrics.spend.toFixed(2)}</TableCell>
              <TableCell>${campaign.metrics.sales.toFixed(2)}</TableCell>
              <TableCell>{campaign.metrics.acos.toFixed(2)}%</TableCell>
              <TableCell>{campaign.metrics.roas.toFixed(2)}x</TableCell>
              <TableCell>{campaign.metrics.impressions}</TableCell>
              <TableCell>{campaign.metrics.clicks}</TableCell>
              <TableCell>{campaign.metrics.ctr.toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
