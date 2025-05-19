import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Filter, ChevronDown, ChevronUp, Info } from 'lucide-react'; // Added Info icon potentially
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardFiltersProps {
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
}

export function DashboardFilters({
  filters,
  onFilterChange,
}: DashboardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: string, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      dateRange: '30d',
      campaignType: 'all',
      minSpend: 0,
      maxSpend: 10000,
      minAcos: 0,
      maxAcos: 100,
      minRoas: 0,
      maxRoas: 20,
      showPaused: true,
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Dashboard Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="dateRange" className="inline-flex items-center gap-1 cursor-help">
                      Date Range <Info className="h-3 w-3" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select the time period for which dashboard data should be displayed.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Select
                value={localFilters.dateRange || '30d'}
                onValueChange={(value) => handleFilterChange('dateRange', value)}
              >
                <SelectTrigger id="dateRange">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="ytd">Year to date</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campaign Type Filter */}
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="campaignType" className="inline-flex items-center gap-1 cursor-help">
                      Campaign Type <Info className="h-3 w-3" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter the dashboard data to show only specific Amazon Advertising campaign types.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Select
                value={localFilters.campaignType || 'all'}
                onValueChange={(value) => handleFilterChange('campaignType', value)}
              >
                <SelectTrigger id="campaignType">
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  <SelectItem value="sponsored_products">Sponsored Products</SelectItem>
                  <SelectItem value="sponsored_brands">Sponsored Brands</SelectItem>
                  <SelectItem value="sponsored_display">Sponsored Display</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Spend Range Filter */}
            <div className="space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label className="inline-flex items-center gap-1 cursor-help">
                      Spend Range ($) <Info className="h-3 w-3" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter campaigns based on their total ad spend within the selected date range. Adjust the slider or enter minimum/maximum values.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={localFilters.minSpend || 0}
                  onChange={(e) => handleFilterChange('minSpend', Number(e.target.value))}
                  className="w-20"
                  min={0}
                />
                <Slider
                  value={[
                    localFilters.minSpend || 0,
                    localFilters.maxSpend || 10000
                  ]}
                  min={0}
                  max={10000}
                  step={100}
                  onValueChange={(value) => {
                    handleFilterChange('minSpend', value[0]);
                    handleFilterChange('maxSpend', value[1]);
                  }}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={localFilters.maxSpend || 10000}
                  onChange={(e) => handleFilterChange('maxSpend', Number(e.target.value))}
                  className="w-20"
                  min={0}
                />
              </div>
            </div>

            {/* ACOS Range Filter */}
            <div className="space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label className="inline-flex items-center gap-1 cursor-help">
                      ACOS Range (%) <Info className="h-3 w-3" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter campaigns based on their Advertising Cost of Sale (Spend / Sales). Lower ACOS generally means higher profitability. Adjust the slider or enter minimum/maximum values.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={localFilters.minAcos || 0}
                  onChange={(e) => handleFilterChange('minAcos', Number(e.target.value))}
                  className="w-20"
                  min={0}
                />
                <Slider
                  value={[
                    localFilters.minAcos || 0,
                    localFilters.maxAcos || 100
                  ]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    handleFilterChange('minAcos', value[0]);
                    handleFilterChange('maxAcos', value[1]);
                  }}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={localFilters.maxAcos || 100}
                  onChange={(e) => handleFilterChange('maxAcos', Number(e.target.value))}
                  className="w-20"
                  min={0}
                />
              </div>
            </div>

            {/* ROAS Range Filter */}
            <div className="space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label className="inline-flex items-center gap-1 cursor-help">
                      ROAS Range <Info className="h-3 w-3" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter campaigns based on their Return On Ad Spend (Sales / Spend). Higher ROAS generally means better returns. Adjust the slider or enter minimum/maximum values.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={localFilters.minRoas || 0}
                  onChange={(e) => handleFilterChange('minRoas', Number(e.target.value))}
                  className="w-20"
                  min={0}
                />
                <Slider
                  value={[
                    localFilters.minRoas || 0,
                    localFilters.maxRoas || 20
                  ]}
                  min={0}
                  max={20}
                  step={0.5}
                  onValueChange={(value) => {
                    handleFilterChange('minRoas', value[0]);
                    handleFilterChange('maxRoas', value[1]);
                  }}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={localFilters.maxRoas || 20}
                  onChange={(e) => handleFilterChange('maxRoas', Number(e.target.value))}
                  className="w-20"
                  min={0}
                />
              </div>
            </div>

            {/* Show Paused Campaigns */}
            <div className="flex items-center justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="showPaused" className="inline-flex items-center gap-1 cursor-help">
                      Show Paused Campaigns <Info className="h-3 w-3" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Include campaigns that are currently paused in the dashboard data and calculations.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Switch
                id="showPaused"
                checked={localFilters.showPaused !== false}
                onCheckedChange={(checked) => handleFilterChange('showPaused', checked)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button onClick={applyFilters}>
              Apply Filters
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
