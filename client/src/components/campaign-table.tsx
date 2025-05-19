import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { type Campaign } from "@shared/schema";
import { ChevronDown, ChevronRight, ChevronUp, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import BidOptimizer from "./bid-optimizer";
import CampaignForecast from "./campaign-forecast"; // Import the new component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportMenu } from "./ui/export-menu";
import { shortenString } from "../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Create a wrapper component to avoid React Fragment issues
const CampaignRow = ({
  campaign, 
  isExpanded, 
  onToggle 
}: { 
  campaign: Campaign, 
  isExpanded: boolean, 
  onToggle: () => void 
}) => (
  <>
    <TableRow
      className="cursor-pointer hover:bg-muted/50 bg-background"
      onClick={onToggle}
      data-campaign-id={campaign.id}
    >
      <TableCell>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-foreground" />
        )}
      </TableCell>
      <TableCell className="font-medium text-foreground">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{shortenString(campaign.name, 35)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{campaign.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-foreground">${(campaign.metrics as CampaignMetrics).spend.toFixed(2)}</TableCell>
      <TableCell className="text-foreground">${(campaign.metrics as CampaignMetrics).sales.toFixed(2)}</TableCell>
      <TableCell className="text-foreground">{(campaign.metrics as CampaignMetrics).acos.toFixed(2)}%</TableCell>
      <TableCell className="text-foreground">{(campaign.metrics as CampaignMetrics).roas.toFixed(2)}x</TableCell>
      <TableCell className="text-foreground">{(campaign.metrics as CampaignMetrics).impressions}</TableCell>
      <TableCell className="text-foreground">{(campaign.metrics as CampaignMetrics).clicks}</TableCell>
      <TableCell className="text-foreground">{(campaign.metrics as CampaignMetrics).ctr.toFixed(2)}%</TableCell>
    </TableRow>
    {isExpanded && (
      <TableRow className="bg-background">
        <TableCell colSpan={9} className="p-4 space-y-4 bg-background text-foreground">
          <BidOptimizer campaignId={campaign.id} />
          <CampaignForecast campaign={campaign} />
        </TableCell>
      </TableRow>
    )}
  </>
);

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

type SortField = 'name' | 'spend' | 'sales' | 'acos' | 'roas' | 'impressions' | 'clicks' | 'ctr';
type SortDirection = 'asc' | 'desc';

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const rowsPerPage = 10;

  const toggleRow = (campaignId: number) => {
    const newExpanded = new Set(expandedRows);
    if (expandedRows.has(campaignId)) {
      newExpanded.delete(campaignId);
    } else {
      newExpanded.add(campaignId);
    }
    setExpandedRows(newExpanded);
  };

  // Handle column sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Sort campaigns based on the selected field and direction
  const sortedCampaigns = [...campaigns].sort((a, b) => {
    let valueA, valueB;

    if (sortField === 'name') {
      valueA = a.name.toLowerCase();
      valueB = b.name.toLowerCase();
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      valueA = (a.metrics as CampaignMetrics)[sortField];
      valueB = (b.metrics as CampaignMetrics)[sortField];
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedCampaigns.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCampaigns = sortedCampaigns.slice(startIndex, startIndex + rowsPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show a subset with current page in the middle when possible
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // Add first page
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('ellipsis');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Render a sort indicator
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 inline ml-1 text-primary" /> 
      : <ChevronDown className="h-4 w-4 inline ml-1 text-primary" />;
  };

  // Define available metrics for export
  const availableMetrics = [
    'name',
    'spend',
    'sales',
    'acos',
    'roas',
    'impressions',
    'clicks',
    'ctr'
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Campaign Performance</h2>
        <ExportMenu 
          reportType="campaign-performance"
          data={{ campaigns: sortedCampaigns }}
          campaigns={campaigns}
          metrics={availableMetrics}
        />
      </div>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-b border-border">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/10 text-foreground font-semibold"
                onClick={() => handleSort('name')}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">Campaign Name</TooltipTrigger>
                    <TooltipContent><p>The name of the Amazon Advertising campaign.</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <SortIndicator field="name" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/10 text-foreground font-semibold"
                onClick={() => handleSort('spend')}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">Spend</TooltipTrigger>
                    <TooltipContent><p>Total amount spent on advertising for this campaign within the selected date range.</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                 <SortIndicator field="spend" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/10 text-foreground font-semibold"
                onClick={() => handleSort('sales')}
              >
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">Sales</TooltipTrigger>
                    <TooltipContent><p>Total sales revenue generated from ads in this campaign within the selected date range.</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <SortIndicator field="sales" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/10 text-foreground font-semibold"
                onClick={() => handleSort('acos')}
              >
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">ACOS</TooltipTrigger>
                    <TooltipContent><p>Advertising Cost of Sale (Spend / Sales). Percentage of sales spent on advertising. Lower is generally better.</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                 <SortIndicator field="acos" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/10 text-foreground font-semibold"
                onClick={() => handleSort('roas')}
              >
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">ROAS</TooltipTrigger>
                    <TooltipContent><p>Return On Ad Spend (Sales / Spend). Revenue generated for every dollar spent on advertising. Higher is generally better.</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                 <SortIndicator field="roas" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/10 text-foreground font-semibold"
                onClick={() => handleSort('impressions')}
              >
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">Impressions</TooltipTrigger>
                    <TooltipContent><p>The number of times ads from this campaign were displayed.</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                 <SortIndicator field="impressions" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/10 text-foreground font-semibold"
                onClick={() => handleSort('clicks')}
              >
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">Clicks</TooltipTrigger>
                    <TooltipContent><p>The number of times ads from this campaign were clicked.</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                 <SortIndicator field="clicks" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/10 text-foreground font-semibold"
                onClick={() => handleSort('ctr')}
              >
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">CTR</TooltipTrigger>
                    <TooltipContent><p>Click-Through Rate (Clicks / Impressions). Percentage of impressions that resulted in a click.</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                 <SortIndicator field="ctr" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCampaigns.map((campaign) => (
              <CampaignRow 
                key={campaign.id}
                campaign={campaign}
                isExpanded={expandedRows.has(campaign.id)}
                onToggle={() => toggleRow(campaign.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-foreground">
            Showing <span className="font-medium">{startIndex + 1}-{Math.min(startIndex + rowsPerPage, campaigns.length)}</span> of <span className="font-medium">{campaigns.length}</span> campaigns
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page as number);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
