import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from './date-picker';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Download, FileText, Landmark, Table } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { type ExportFormat, type ReportType, type ExportOptions, type DateRange, exportData } from '@shared/services/export-service';

interface ExportMenuProps {
  reportType: ReportType;
  data: any;
  campaigns?: any[];
  metrics?: string[];
  triggerClassName?: string;
}

export function ExportMenu({ 
  reportType, 
  data, 
  campaigns = [],
  metrics = [],
  triggerClassName 
}: ExportMenuProps) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<Partial<ExportOptions>>({
    includeExecutiveSummary: true,
    includeGlossary: true,
    includeRecommendations: true,
    includeBranding: true,
    includeTimestamp: true,
    customTitle: getDefaultTitle(reportType),
  });
  const [activeTab, setActiveTab] = useState('general');
  
  // For date range selection
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date()
  });
  
  // For campaign selection
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [selectAllCampaigns, setSelectAllCampaigns] = useState(true);
  
  // For metric selection
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectAllMetrics, setSelectAllMetrics] = useState(true);
  
  function getDefaultTitle(reportType: ReportType): string {
    const titles = {
      'campaign-performance': 'Campaign Performance Report',
      'rule-analysis': 'Rule Analysis Report',
      'bid-optimization': 'Bid Optimization Recommendations',
      'forecasting': 'Campaign Forecast Report',
      'historical-trends': 'Historical Performance Trends',
      'anomaly-detection': 'Anomaly Detection Report',
      'time-of-day': 'Time-of-Day Performance Analysis',
      'custom-metrics': 'Custom Metrics Report',
    };
    return titles[reportType];
  }
  
  function handleFormatSelect(format: ExportFormat) {
    setSelectedFormat(format);
    setIsExportDialogOpen(true);
  }
  
  function handleExportOptionChange(key: keyof ExportOptions, value: any) {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  }
  
  function handleSelectAllCampaigns(checked: boolean) {
    setSelectAllCampaigns(checked);
    if (checked) {
      setSelectedCampaigns(campaigns.map(c => c.id));
    } else {
      setSelectedCampaigns([]);
    }
  }
  
  function handleCampaignSelect(campaignId: number, checked: boolean) {
    if (checked) {
      setSelectedCampaigns(prev => [...prev, campaignId]);
    } else {
      setSelectedCampaigns(prev => prev.filter(id => id !== campaignId));
    }
  }
  
  function handleSelectAllMetrics(checked: boolean) {
    setSelectAllMetrics(checked);
    if (checked) {
      setSelectedMetrics(metrics);
    } else {
      setSelectedMetrics([]);
    }
  }
  
  function handleMetricSelect(metric: string, checked: boolean) {
    if (checked) {
      setSelectedMetrics(prev => [...prev, metric]);
    } else {
      setSelectedMetrics(prev => prev.filter(m => m !== metric));
    }
  }
  
  async function handleExport() {
    setIsExporting(true);
    
    try {
      const options: ExportOptions = {
        format: selectedFormat,
        reportType,
        dateRange: dateRange,
        selectedCampaigns: selectAllCampaigns ? undefined : selectedCampaigns,
        selectedMetrics: selectAllMetrics ? undefined : selectedMetrics,
        ...exportOptions,
      };
      
      await exportData(data, options);
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      // Could show an error toast here
    } finally {
      setIsExporting(false);
    }
  }
  
  // Format specific icons
  const formatIcons = {
    pdf: <FileText className="h-4 w-4 mr-2" />,
    csv: <Table className="h-4 w-4 mr-2" />,
    xlsx: <Table className="h-4 w-4 mr-2" />,
    json: <Landmark className="h-4 w-4 mr-2" />,
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={triggerClassName}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleFormatSelect('pdf')}>
            {formatIcons.pdf}
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormatSelect('csv')}>
            {formatIcons.csv}
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormatSelect('xlsx')}>
            {formatIcons.xlsx}
            Export as Excel
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleFormatSelect('json')}>
            {formatIcons.json}
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {formatIcons[selectedFormat]}
              Export as {selectedFormat.toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Configure your export options. Click "Export" when you're ready.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="data">Data Options</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Report Title</Label>
                  <Input 
                    id="title" 
                    value={exportOptions.customTitle || ''} 
                    onChange={(e) => handleExportOptionChange('customTitle', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex flex-col">
                  <Label>Date Range</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                      <DatePicker 
                        date={dateRange.startDate} 
                        setDate={(date) => setDateRange(prev => ({ ...prev, startDate: date }))} 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-xs">End Date</Label>
                      <DatePicker 
                        date={dateRange.endDate} 
                        setDate={(date) => setDateRange(prev => ({ ...prev, endDate: date }))} 
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeTimestamp" 
                    checked={exportOptions.includeTimestamp} 
                    onCheckedChange={(checked) => handleExportOptionChange('includeTimestamp', checked)}
                  />
                  <Label htmlFor="includeTimestamp">Include timestamp in filename</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="space-y-4">
              <div className="space-y-4">
                {campaigns.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Select Campaigns</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="selectAllCampaigns" 
                          checked={selectAllCampaigns} 
                          onCheckedChange={(checked) => handleSelectAllCampaigns(checked as boolean)}
                        />
                        <Label htmlFor="selectAllCampaigns" className="text-sm">Select All</Label>
                      </div>
                    </div>
                    <div className="border rounded-md p-3 max-h-36 overflow-y-auto">
                      {selectAllCampaigns ? (
                        <p className="text-muted-foreground text-sm">All campaigns will be included</p>
                      ) : (
                        campaigns.map(campaign => (
                          <div key={campaign.id} className="flex items-center space-x-2 mb-2">
                            <Checkbox 
                              id={`campaign-${campaign.id}`} 
                              checked={selectedCampaigns.includes(campaign.id)} 
                              onCheckedChange={(checked) => handleCampaignSelect(campaign.id, checked as boolean)}
                            />
                            <Label htmlFor={`campaign-${campaign.id}`} className="text-sm">{campaign.name}</Label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                
                {metrics.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Select Metrics</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="selectAllMetrics" 
                          checked={selectAllMetrics} 
                          onCheckedChange={(checked) => handleSelectAllMetrics(checked as boolean)}
                        />
                        <Label htmlFor="selectAllMetrics" className="text-sm">Select All</Label>
                      </div>
                    </div>
                    <div className="border rounded-md p-3 max-h-36 overflow-y-auto">
                      {selectAllMetrics ? (
                        <p className="text-muted-foreground text-sm">All metrics will be included</p>
                      ) : (
                        metrics.map(metric => (
                          <div key={metric} className="flex items-center space-x-2 mb-2">
                            <Checkbox 
                              id={`metric-${metric}`} 
                              checked={selectedMetrics.includes(metric)} 
                              onCheckedChange={(checked) => handleMetricSelect(metric, checked as boolean)}
                            />
                            <Label htmlFor={`metric-${metric}`} className="text-sm">{metric}</Label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeExecutiveSummary" 
                      checked={exportOptions.includeExecutiveSummary} 
                      onCheckedChange={(checked) => handleExportOptionChange('includeExecutiveSummary', checked)}
                    />
                    <Label htmlFor="includeExecutiveSummary">Include executive summary</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeRecommendations" 
                      checked={exportOptions.includeRecommendations} 
                      onCheckedChange={(checked) => handleExportOptionChange('includeRecommendations', checked)}
                    />
                    <Label htmlFor="includeRecommendations">Include recommendations</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeGlossary" 
                      checked={exportOptions.includeGlossary} 
                      onCheckedChange={(checked) => handleExportOptionChange('includeGlossary', checked)}
                    />
                    <Label htmlFor="includeGlossary">Include glossary of metrics</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeBranding" 
                    checked={exportOptions.includeBranding} 
                    onCheckedChange={(checked) => handleExportOptionChange('includeBranding', checked)}
                  />
                  <Label htmlFor="includeBranding">Include Ecom Hawks branding</Label>
                </div>
                
                {selectedFormat === 'pdf' && (
                  <>
                    <div>
                      <Label htmlFor="themeColor">Theme Color</Label>
                      <Select 
                        value={exportOptions.themeColor || 'orange'} 
                        onValueChange={(value) => handleExportOptionChange('themeColor', value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select a color theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="orange">Orange (Default)</SelectItem>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="gray">Neutral Gray</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="pageSize">Page Size</Label>
                      <Select 
                        value={exportOptions.pageSize || 'a4'} 
                        onValueChange={(value) => handleExportOptionChange('pageSize', value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select page size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a4">A4 (Default)</SelectItem>
                          <SelectItem value="letter">US Letter</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}