
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
            bid: parseFloat(bid) || 0,
            adGroupDefaultBid: parseFloat(adGroupDefaultBid) || 0,
            spend: parseFloat(spend) || 0,
            sales: parseFloat(sales) || 0,
            orders: parseInt(orders) || 0,
            clicks: parseInt(clicks) || 0,
            roas: parseFloat(roas) || 0,
            impressions: parseInt(impressions) || 0
          };
        });

      const response = await apiRequest('/api/upload-csv', {
        method: 'POST',
        body: JSON.stringify(rows)
      });

      if (response.ok) {
        queryClient.invalidateQueries(['/api/campaigns']);
        toast({
          title: "Success",
          description: "CSV data uploaded successfully"
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload CSV file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Upload Campaign Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            size="lg"
            disabled={isUploading}
            onClick={() => document.getElementById('csv-upload')?.click()}
            className="w-full sm:w-auto"
          >
            <Upload className={`mr-2 h-5 w-5 ${isUploading ? 'animate-spin' : ''}`} />
            {isUploading ? 'Uploading...' : 'Upload CSV File'}
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
