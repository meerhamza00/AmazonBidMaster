import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { csvRowSchema } from "@shared/schema";

export default function CsvUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const rows = text.split('\n').slice(1); // Skip header row
      const data = rows.map(row => {
        const [campaignName, spend, sales, acos, roas, impressions, clicks, ctr, cpc, orders] = row.split(',');
        return {
          campaignName,
          spend: parseFloat(spend),
          sales: parseFloat(sales),
          acos: parseFloat(acos),
          roas: parseFloat(roas),
          impressions: parseInt(impressions),
          clicks: parseInt(clicks),
          ctr: parseFloat(ctr),
          cpc: parseFloat(cpc),
          orders: parseInt(orders)
        };
      });

      // Validate data
      data.forEach(row => {
        csvRowSchema.parse(row);
      });

      await apiRequest('POST', '/api/upload-csv', data);

      toast({
        title: "Success",
        description: "CSV data uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload CSV data. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
            <Upload className="mr-2 h-4 w-4" />
            Select CSV File
          </Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
        </div>
      </CardContent>
    </Card>
  );
}
