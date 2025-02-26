import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { csvRowSchema } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function CsvUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const rows = text.split('\n')
        .slice(1) // Skip header row
        .filter(row => row.trim()) // Remove empty rows
        .map(row => {
          const [
            campaignName,
            portfolioName,
            campaignState,
            bid,
            adGroupDefaultBid,
            spend,
            sales,
            orders,
            clicks,
            roas,
            impressions
          ] = row.split(',').map(cell => cell.trim());

          return {
            campaignName,
            portfolioName,
            campaignState,
            bid: parseFloat(bid),
            adGroupDefaultBid: parseFloat(adGroupDefaultBid),
            spend: parseFloat(spend),
            sales: parseFloat(sales),
            orders: parseInt(orders),
            clicks: parseInt(clicks),
            roas: parseFloat(roas),
            impressions: parseInt(impressions)
          };
        });

      // Validate data
      rows.forEach(row => {
        csvRowSchema.parse(row);
      });

      await apiRequest('POST', '/api/upload-csv', rows);

      // Invalidate campaigns query to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });

      toast({
        title: "Success",
        description: `Successfully uploaded ${rows.length} campaigns`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload CSV data. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = ''; // Reset the input
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Campaign Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById('csv-upload')?.click()}
          >
            <Upload className={`mr-2 h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
            {isUploading ? 'Uploading...' : 'Select CSV File'}
          </Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </CardContent>
    </Card>
  );
}