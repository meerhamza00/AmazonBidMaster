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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const fileContent = await file.text();
    const response = await fetch('/api/upload-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: fileContent })
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }
      queryClient.invalidateQueries(['/api/campaigns']);
      toast({
        title: "Success",
        description: "CSV data uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload CSV file",
        variant: "destructive"
      });
      console.error('Error uploading file:', error);
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