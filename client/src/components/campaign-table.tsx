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
      className="cursor-pointer hover:bg-muted/50"
      onClick={onToggle}
      data-campaign-id={campaign.id}
    >
      <TableCell>
        {isExpanded ? (
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
    {isExpanded && (
      <TableRow>
        <TableCell colSpan={9} className="p-4 space-y-4">
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
      ? <ChevronUp className="h-4 w-4 inline ml-1" /> 
      : <ChevronDown className="h-4 w-4 inline ml-1" />;
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
        <h2 className="text-2xl font-bold">Campaign Performance</h2>
        <ExportMenu 
          reportType="campaign-performance"
          data={{ campaigns: sortedCampaigns }}
          campaigns={campaigns}
          metrics={availableMetrics}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/10"
                onClick={() => handleSort('name')}
              >
                Campaign Name <SortIndicator field="name" />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/10"
                onClick={() => handleSort('spend')}
              >
                Spend <SortIndicator field="spend" />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/10"
                onClick={() => handleSort('sales')}
              >
                Sales <SortIndicator field="sales" />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/10"
                onClick={() => handleSort('acos')}
              >
                ACOS <SortIndicator field="acos" />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/10"
                onClick={() => handleSort('roas')}
              >
                ROAS <SortIndicator field="roas" />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/10"
                onClick={() => handleSort('impressions')}
              >
                Impressions <SortIndicator field="impressions" />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/10"
                onClick={() => handleSort('clicks')}
              >
                Clicks <SortIndicator field="clicks" />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/10"
                onClick={() => handleSort('ctr')}
              >
                CTR <SortIndicator field="ctr" />
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
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + rowsPerPage, campaigns.length)} of {campaigns.length} campaigns
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